defmodule Subs.Test.Support.Factory do
  @moduledoc false
  use ExMachina.Ecto, repo: Repository.Repo
  alias Subs.Helpers.Crypto
  alias Subs.{User, Subscription}

  @dt Application.get_env(:subs, :dt)

  def user_factory do
    %User{
      name: "Jon Snow",
      email: sequence(:email, &"jon.snow.#{&1}@email.com"),
      password: "password",
      password_confirmation: "password",
      confirmation_token: "111xxx222yyy333zzz",
      encrypted_confirmation_token: Crypto.sha1("111xxx222yyy333zzz"),
      currency: "GBP",
      currency_symbol: "£"
    }
  end

  def subscription_factory do
    %Subscription{
      name: "Custom Service",
      amount: 7,
      amount_currency: "GBP",
      cycle: "monthly"
    }
  end

  def complete_subscription_factory do
    %Subscription{
      name: "Custom Service",
      amount: 700,
      amount_currency: "GBP",
      amount_currency_symbol: "£",
      cycle: "monthly",
      first_bill_date: @dt.now(),
      next_bill_date: @dt.now()
    }
  end

  def archived_subscription_factory do
    build(:complete_subscription, %{archived: true, archived_at: @dt.now()})
  end
end
