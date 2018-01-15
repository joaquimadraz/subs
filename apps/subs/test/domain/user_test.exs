defmodule Subs.Test.Domain.UserTest do
  use ExUnit.Case
  alias Subs.User
  import Subs.Test.Support.Factory

  describe "given user params" do
    setup [:build_params]

    setup(context) do
      Map.merge(%{user: create_user(context.params)}, context)
    end

    test "should encrypt password", %{user: user} do
      encrypted_password = Ecto.Changeset.get_change(user, :encrypted_password)

      assert encrypted_password != nil
      assert String.length(encrypted_password) > 0
    end

    test "confirmation_token is set", %{user: user} do
      confirmation_token = Ecto.Changeset.get_change(user, :confirmation_token)
      assert confirmation_token != nil
    end
  end

  describe "given an multi cased email" do
    setup [:build_params]

    test "should format email", %{params: params} do
      params = %{params | "email" => "bEe@EMAIL.com"}

      email =
        params
        |> create_user
        |> Ecto.Changeset.get_change(:email)

      assert email == String.downcase(params["email"])
    end
  end

  describe "given an invalid email" do
    setup [:build_params]

    test "should return error for invalid email", %{params: params} do
      params = %{params | "email" => "invalid"}
      user = create_user(params)
      {message, _} = user.errors[:email]

      assert message == "has invalid format"
    end
  end

  test "returns error for missing require currency" do
    params = string_params_for(:user) |> Map.take(["email"])
    user = create_user(params)

    assert {"can't be blank", _} = user.errors[:currency]
  end

  test "returns error for unknown currency" do
    params = %{string_params_for(:user) | "currency" => "AUD"}
    user = create_user(params)

    assert {"is invalid", _} = user.errors[:currency]
  end

  test "populates currency symbol" do
    params = %{string_params_for(:user) | "currency" => "USD"}
    user = create_user(params)

    assert user.changes.currency_symbol == "$"
  end

  def create_user(params) do
    User.create_changeset(%User{}, params)
  end

  def build_params(_) do
    [params: string_params_for(:user)]
  end
end
