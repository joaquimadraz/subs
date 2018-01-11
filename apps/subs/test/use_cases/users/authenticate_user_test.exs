defmodule Subs.Test.UseCases.Users.AuthenticateUserTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory

  alias Subs.UseCases.Users.AuthenticateUser
  alias Subs.Test.Support.BCrypt

  describe "given an user and valid credentials" do
    setup [:create_user]
    setup context do
      {:ok, %{user: user}} =
        AuthenticateUser.perform(context.email, context.password)

      [user: user, email: context.email]
    end

    test "should authenticate user", %{user: user, email: email} do
      assert user.email == email
    end
  end

  describe "given an user and invalid password" do
    setup [:create_user]

    test "should not authenticate user", %{email: email} do
      {:error, {error, _}} = AuthenticateUser.perform(email, "invalid")

      assert error == :invalid_credentials
    end
  end

  describe "given an user and invalid email" do
    setup [:create_user]

    test "should not authenticate user" do
      {:error, {error, _}} = AuthenticateUser.perform("doesnt@exists.com",
                                                      "password")

      assert error == :invalid_credentials
    end
  end

  defp create_user(_) do
    password = "password"
    user =
      insert(
        :user,
        email: "email@email.com",
        encrypted_password: BCrypt.hashpwsalt(password),
        confirmed_at: NaiveDateTime.utc_now(),
      )

    [
      user: user,
      email: user.email,
      password: password
    ]
  end
end
