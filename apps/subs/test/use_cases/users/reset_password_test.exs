defmodule Subs.Test.UseCases.Users.ResetUserPasswordTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory

  alias Subs.UseCases.Users.ResetUserPassword

  describe "given an unknown token" do
    test "returns invalid token error" do
      {:error, {error, _}} = ResetUserPassword.perform("token", %{})

      assert error == :invalid_token
    end
  end
end
