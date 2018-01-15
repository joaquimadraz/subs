defmodule Subs.Test.Domain.UserTest do
  use ExUnit.Case
  alias Subs.User
  import Subs.Test.Support.Factory

  @bcrypt Application.get_env(:subs, :bcrypt)

  describe "create_changeset" do
    test "encrypts password" do
      params = %{string_params_for(:user) | "password" => "11223344"}
      user = create_changeset(params)

      assert user.changes.encrypted_password == @bcrypt.hashpwsalt("11223344")
    end

    test "confirmation token is set" do
      params = string_params_for(:user)
      user = create_changeset(params)

      assert user.changes.confirmation_token != nil
    end

    test "correctly formats email" do
      params = %{string_params_for(:user) | "email" => "eXaMPle@EMAIL.com"}
      user = create_changeset(params)

      assert user.changes.email == "example@email.com"
    end

    test "returns error for invalid email"do
      params = %{string_params_for(:user) | "email" => "invalid"}
      user = create_changeset(params)

      assert {"has invalid format", _} = user.errors[:email]
    end

    test "returns error for missing require currency" do
      params = string_params_for(:user) |> Map.take(["email", "password", "password_confirmation"])
      user = create_changeset(params)

      assert {"can't be blank", _} = user.errors[:currency]
    end

    test "returns error for unknown currency" do
      params = %{string_params_for(:user) | "currency" => "AUD"}
      user = create_changeset(params)

      assert {"is invalid", _} = user.errors[:currency]
    end

    test "populates currency symbol" do
      params = %{string_params_for(:user) | "currency" => "USD"}
      user = create_changeset(params)

      assert user.changes.currency_symbol == "$"
    end
  end

  def create_changeset(params) do
    User.create_changeset(%User{}, params)
  end
end
