defmodule Subs.Test.Domain.SubscriptionTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory
  alias Subs.Subscription
  alias Ecto.Changeset

  @dt Application.get_env(:subs, :dt)

  def create_changeset(params) do
    Subscription.create_changeset(%Subscription{}, params)
  end

  def build_changeset_with_user(user, params) do
    Subscription.build_with_user(user, params)
  end

  def update_changeset(subscription, params) do
    Subscription.update_changeset(subscription, params)
  end

  describe "update_changeset" do
    test "changing anything else than first_bill_date should not change first_bill_date" do
      user = insert(:user)

      subscription =
        insert(:complete_subscription, user: user, first_bill_date: ~N[2017-12-25T00:00:00Z])

      changeset = update_changeset(subscription, %{"amount" => "9.99"})

      assert 999 = Changeset.get_change(changeset, :amount)
      assert Changeset.get_change(changeset, :first_bill_date) == nil
      assert ~N[2017-12-25T00:00:00Z] = Changeset.get_field(changeset, :first_bill_date)
    end

    test "updates nothing" do
      subscription = build(:complete_subscription)
      changeset = update_changeset(subscription, %{})

      assert changeset.valid? == true
    end

    test "returns error for invalid currency" do
      subscription = build(:complete_subscription)
      changeset = update_changeset(subscription, %{"amount_currency" => "HEY"})

      assert changeset.valid? == false
      assert {"unknown currency", _} = changeset.errors[:amount_currency]
    end

    test "updates first_bill_date and next_bill_date for 2020" do
      subscription = build(:complete_subscription)

      changeset =
        update_changeset(subscription, %{
          "first_bill_date" => "2020-01-01T00:00:00Z"
        })

      first_bill_date = Changeset.get_change(changeset, :first_bill_date)
      next_bill_date = Changeset.get_change(changeset, :next_bill_date)

      assert changeset.valid? == true
      assert first_bill_date == ~N[2020-01-01T00:00:00Z]
      # I would love to see this test fail in January of 2020
      assert next_bill_date == ~N[2020-01-01T00:00:00Z]
    end

    test "sets archived_at when archived flag is sent true on updated " do
      subscription = build(:complete_subscription)
      changeset = update_changeset(subscription, %{"archived" => true})

      assert Changeset.get_change(changeset, :archived) == true
      assert Changeset.get_change(changeset, :archived_at) != nil
    end
  end

  describe "user" do
    test "returns error for missing user" do
      non_persisted_user = build(:user)
      params = string_params_for(:subscription)
      changeset = build_changeset_with_user(non_persisted_user, params)

      assert {"can't be blank", _} = changeset.errors[:user_id]
    end

    test "creates subscription from user" do
      user = insert(:user)
      params = string_params_for(:subscription)
      changeset = build_changeset_with_user(user, params)

      assert changeset.valid? == true
    end
  end

  describe "color" do
    test "returns error for invalid color format" do
      params = string_params_for(:subscription, color: "invalid")
      changeset = create_changeset(params)

      assert {"invalid format, must be HEX format, ex: #FF0000", _} = changeset.errors[:color]
    end

    test "upcases color value" do
      params = string_params_for(:subscription, color: "#Ff00aB")
      changeset = create_changeset(params)
      color = Changeset.get_change(changeset, :color)

      assert color == "#FF00AB"
    end
  end

  describe "amount, amount_currency and amount_currency_symbol" do
    test "returns error for invalid currency" do
      params =
        string_params_for(
          :subscription,
          amount: 799,
          amount_currency: "WHAT"
        )

      changeset = create_changeset(params)

      assert {"unknown currency", _} = changeset.errors[:amount_currency]
    end

    test "populates amount_currency_symbol" do
      params =
        string_params_for(
          :subscription,
          amount: 799,
          amount_currency: "GBP"
        )

      changeset = create_changeset(params)
      symbol = Changeset.get_change(changeset, :amount_currency_symbol)

      assert symbol == "£"
    end
  end

  describe "cycle" do
    test "returns error for invalid cycle" do
      params =
        string_params_for(
          :subscription,
          cycle: "hourly"
        )

      changeset = create_changeset(params)

      assert {"must be one of: monthly, yearly", _} = changeset.errors[:cycle]
    end
  end

  # All these tests have DTMock.now() in consideration now.
  describe "first_bill_date and next_bill_date" do
    setup do
      [user: insert(:user)]
    end

    test "populates first_bill_date if not given", %{user: user} do
      params = string_params_for(:subscription)
      changeset = build_changeset_with_user(user, params)
      first_bill_date = Changeset.get_change(changeset, :first_bill_date)

      assert NaiveDateTime.to_date(first_bill_date) == NaiveDateTime.to_date(@dt.now())
    end

    test "populates next_bill_date based on monthly cycle", %{user: user} do
      params =
        string_params_for(
          :subscription,
          first_bill_date: "2017-07-12T00:00:00Z"
        )

      changeset = build_changeset_with_user(user, params)
      next_bill_date = Changeset.get_change(changeset, :next_bill_date)

      assert next_bill_date == ~N[2017-08-12 00:00:00]
    end

    test "populates next_bill_date based on yearly cycle", %{user: user} do
      params =
        string_params_for(
          :subscription,
          cycle: "yearly",
          first_bill_date: "2017-07-12T00:00:00Z"
        )

      changeset = build_changeset_with_user(user, params)
      next_bill_date = Changeset.get_change(changeset, :next_bill_date)

      assert next_bill_date == ~N[2018-07-12 00:00:00]
    end

    test "populates next_bill_date for next month if first_fill_date is from the past", %{
      user: user
    } do
      params =
        string_params_for(
          :subscription,
          cycle: "monthly",
          first_bill_date: "2017-01-01T00:00:00Z"
        )

      changeset = build_changeset_with_user(user, params)
      next_bill_date = Changeset.get_change(changeset, :next_bill_date)

      assert next_bill_date == ~N[2017-09-01 00:00:00]
    end

    test "populates next_bill_date for next year if first_fill_date is from the past", %{
      user: user
    } do
      params =
        string_params_for(
          :subscription,
          cycle: "yearly",
          first_bill_date: "2016-01-01T00:00:00Z"
        )

      changeset = build_changeset_with_user(user, params)
      next_bill_date = Changeset.get_change(changeset, :next_bill_date)

      assert next_bill_date == ~N[2018-01-01 00:00:00]
    end

    test "populates next_bill_date advancing a bunch of months", %{user: user} do
      params =
        string_params_for(
          :subscription,
          cycle: "yearly",
          first_bill_date: "1900-01-01T00:00:00Z"
        )

      changeset = build_changeset_with_user(user, params)
      next_bill_date = Changeset.get_change(changeset, :next_bill_date)

      assert next_bill_date == ~N[2018-01-01 00:00:00]
    end
  end

  describe "service" do
    setup do
      changeset =
        create_changeset(%{
          "service_code" => "github",
          "amount" => 7.99,
          "amount_currency" => "GBP",
          "cycle" => "monthly",
          "user_id" => 1
        })

      [changeset: changeset]
    end

    test "does not return error for missing name when sending code", %{changeset: changeset} do
      assert changeset.valid?
    end

    test "name is populated with service data", %{changeset: changeset} do
      assert changeset.changes.name == "Github"
    end

    test "color is populated with service data", %{changeset: changeset} do
      assert changeset.changes.color == "#000000"
    end

    test "return error for unknown service code" do
      changeset =
        create_changeset(%{
          "service_code" => "what",
          "amount" => 7.99,
          "amount_currency" => "GBP",
          "cycle" => "monthly",
          "user_id" => 1
        })

      assert !changeset.valid?
      assert {"unknown service", _} = changeset.errors[:service_code]
    end
  end
end
