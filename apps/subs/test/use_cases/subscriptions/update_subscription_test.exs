defmodule Subs.Test.UseCases.Subscriptions.UpdateSubscriptionTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory

  alias Subs.UseCases.Subscriptions.UpdateSubscription

  setup do
    [user: insert(:user)]
  end

  test "returns 404 error for unknown subscription", %{user: user} do
    subscription = insert(:complete_subscription, user_id: insert(:user).id)

    assert {:error, {:subscription_not_found, _}} =
      UpdateSubscription.perform(user, subscription.id, %{})
  end

  test "returns error for invalid params", %{user: user} do
    subscription = insert(:complete_subscription, user_id: user.id)
    {:error, {error, %{changeset: changeset}}} =
      UpdateSubscription.perform(user, subscription.id, %{"name" => ""})

    assert error == :invalid_params
    assert {"can't be blank", _} = changeset.errors[:name]
  end

  test "returns updated subscription", %{user: user} do
    subscription = insert(:complete_subscription, user_id: user.id)
    {:ok, %{subscription: subscription}} =
      UpdateSubscription.perform(user, subscription.id, %{"name" => "Updated"})

    assert subscription.name == "Updated"
  end

  test "updates subscription with consolidated amount", %{user: user} do
    subscription = insert(:complete_subscription, user_id: user.id)
    {:ok, %{subscription: subscription}} =
      UpdateSubscription.perform(user, subscription.id, %{"amount" => "1.50"})

    assert subscription.amount == 150
  end

  test "archives subscription and sets archived_at", %{user: user} do
    subscription = insert(:complete_subscription, user_id: user.id)
    {:ok, %{subscription: subscription}} =
      UpdateSubscription.perform(user, subscription.id, %{"archived" => true})

    assert subscription.archived == true
    assert subscription.archived_at != nil
  end

  test "updates cycle and recalculates next_bill_date", %{user: user} do
    subscription = insert(
      :complete_subscription,
      user_id: user.id,
      cycle: "monthly",
      first_bill_date: ~N[2017-08-01T00:00:00Z],
      next_bill_date: ~N[2017-09-01T00:00:00Z],
    )

    {:ok, %{subscription: subscription}} =
      UpdateSubscription.perform(user, subscription.id, %{"cycle" => "yearly"})

    assert subscription.next_bill_date == ~N[2018-08-01T00:00:00.000000]
  end
end
