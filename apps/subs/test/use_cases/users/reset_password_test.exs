defmodule Subs.Test.UseCases.Users.ResetUserPasswordTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory

  alias Subs.Helpers.Crypto
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
end
