defmodule Subs.Test.UseCases.Users.ResetUserPasswordTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory

  alias Subs.Helpers.Crypto
  alias Subs.Test.Support.BCrypt
  alias Subs.UseCases.Users.ResetUserPassword

  @dt Application.get_env(:subs, :dt)

  test "returns invalid token error" do
    {:error, {error, _}} = ResetUserPassword.perform("token", %{})

    assert error == :invalid_token
  end

  test "returns error for token expired" do
    user = insert(
      :user,
      password_recovery_token: "aaabbbccc",
      encrypted_password_recovery_token: Crypto.sha1("aaabbbccc"),
      password_recovery_expires_at: @dt.step_date(@dt.now(), :hours, -1)
    )

    {:error, {error, _}} = ResetUserPassword.perform(user.password_recovery_token, %{})

    assert error == :token_expired
  end

  test "returns error for invalid password" do
    user = insert(
      :user,
      password_recovery_token: "aaabbbccc",
      encrypted_password_recovery_token: Crypto.sha1("aaabbbccc"),
      password_recovery_expires_at: @dt.step_date(@dt.now(), :hours, 1),
    )

    {:error, {error, %{changeset: changeset}}} =
      ResetUserPassword.perform(user.password_recovery_token, %{})

    assert error == :invalid_params
    assert {"can't be blank", [validation: :required]} = changeset.errors[:password]
    assert {"can't be blank", [validation: :required]} = changeset.errors[:password_confirmation]
  end

  test "returns error for password confirmation not matching" do
    user = insert(
      :user,
      password_recovery_token: "aaabbbccc",
      encrypted_password_recovery_token: Crypto.sha1("aaabbbccc"),
      password_recovery_expires_at: @dt.step_date(@dt.now(), :hours, 1),
    )

    {:error, {error, %{changeset: changeset}}} =
      ResetUserPassword.perform(user.password_recovery_token, %{
        password: "123456",
        password_confirmation: "456789"
      })

    assert error == :invalid_params
    assert {"does not match confirmation", [validation: :confirmation]} =
      changeset.errors[:password_confirmation]
  end

  test "updates user password and resets password recovery fields" do
     user = insert(
      :user,
      password_recovery_token: "aaabbbccc",
      encrypted_password_recovery_token: Crypto.sha1("aaabbbccc"),
      password_recovery_expires_at: @dt.step_date(@dt.now(), :hours, 1),
    )

    new_password = "123456"

    {:ok, %{user: user}} =
      ResetUserPassword.perform(user.password_recovery_token, %{
        password: new_password,
        password_confirmation: new_password
      })

    assert user.encrypted_password == BCrypt.hashpwsalt(new_password)
    assert user.password_recovery_token == nil
    assert user.encrypted_password_recovery_token == nil
    assert user.password_recovery_expires_at == nil
  end
end
