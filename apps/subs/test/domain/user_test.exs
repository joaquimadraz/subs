defmodule Subs.Test.Domain.UserTest do
  use SubsWeb.ConnCase
  alias Subs.User
  import Subs.Test.Support.Factory

  @bcrypt Application.get_env(:subs, :bcrypt)

  describe "create_changeset" do
    test "encrypts password" do
      params = %{string_params_for(:user) | "password" => "11223344"}
      changeset = create_changeset(params)

      assert changeset.changes.encrypted_password == @bcrypt.hashpwsalt("11223344")
    end

    test "confirmation token is set" do
      params = string_params_for(:user)
      changeset = create_changeset(params)

      assert changeset.changes.confirmation_token != nil
    end

    test "correctly formats email" do
      params = %{string_params_for(:user) | "email" => "eXaMPle@EMAIL.com"}
      changeset = create_changeset(params)

      assert changeset.changes.email == "example@email.com"
    end

    test "returns error for invalid email"do
      params = %{string_params_for(:user) | "email" => "invalid"}
      changeset = create_changeset(params)

      assert {"has invalid format", _} = changeset.errors[:email]
    end

    test "returns error for missing require currency" do
      params = string_params_for(:user) |> Map.take(["email", "password", "password_confirmation"])
      changeset = create_changeset(params)

      assert {"can't be blank", _} = changeset.errors[:currency]
    end

    test "returns error for unknown currency" do
      params = %{string_params_for(:user) | "currency" => "AUD"}
      changeset = create_changeset(params)

      assert {"is invalid", _} = changeset.errors[:currency]
    end

    test "populates currency symbol" do
      params = %{string_params_for(:user) | "currency" => "USD"}
      changeset = create_changeset(params)

      assert changeset.changes.currency_symbol == "$"
    end
  end

  describe "update_changeset" do
    test "updates user currency" do
      user = insert(:user, currency: "USD", currency_symbol: "$")
      params = %{"currency" => "EUR"}
      changeset = update_changeset(user, params)

      assert changeset.changes.currency == "EUR"
      assert changeset.changes.currency_symbol == "€"
    end

    test "returns error for unknown currency" do
      user = insert(:user)
      params = %{string_params_for(:user) | "currency" => "AUD"}
      changeset = update_changeset(user, params)

      assert {"is invalid", _} = changeset.errors[:currency]
    end
  end

  def create_changeset(params) do
    User.create_changeset(%User{}, params)
  end

  def update_changeset(user, params) do
    User.update_changeset(user, params)
  end
end
