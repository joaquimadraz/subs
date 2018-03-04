defmodule Subs.SubscriptionRepo do
  @moduledoc false
  import Ecto.Query
  alias Subs.{Subscription, SubsNotification, SubsNotificationsSubscription}
  alias Repository.Repo

  def create(params) do
    %Subscription{}
    |> Subscription.create_changeset(params)
    |> Repo.insert()
  end

  def update(subscription, params) do
    subscription
    |> Subscription.update_changeset(params)
    |> Repo.update()
  end

  def create_with_user(user, params) do
    Subscription.build_with_user(user, params)
    |> Repo.insert()
  end

  def get_user_subscriptions(user, filters) do
    query =
      from(
        s in Subscription,
        where: s.user_id == ^user.id and s.archived == false,
        order_by: s.name
      )
      |> apply_next_bill_date_filter(filters)

    Repo.all(query)
  end

  def get_user_subscription(user, subscription_id) do
    Repo.get_by(Subscription, user_id: user.id, id: subscription_id)
  end

  def get_subscription_notifications(subscription_id, status \\ :pending) do
    query =
      from(
        sn in SubsNotification,
        join: snb in SubsNotificationsSubscription,
        where: snb.subs_notification_id == sn.id and snb.subscription_id == ^subscription_id
      )

    Repo.all(query)
  end

  def get_billable_subscriptions(from, to) do
    query =
      from(
        s in Subscription,
        where: s.next_bill_date >= ^from and s.next_bill_date <= ^to and s.archived == false,
        preload: :user
      )

    Repo.all(query)
  end

  defp apply_next_bill_date_filter(query, filters) do
    query
    |> apply_next_bill_date_gt(filters)
    |> apply_next_bill_date_lt(filters)
  end

  defp apply_next_bill_date_gt(query, %{"next_bill_date_gte" => date}) do
    parsed = Timex.parse!(date, "%Y-%m-%d", :strftime)

    from(s in query, where: s.next_bill_date >= ^parsed)
  end

  defp apply_next_bill_date_gt(query, _), do: query

  defp apply_next_bill_date_lt(query, %{"next_bill_date_lte" => date}) do
    parsed = Timex.parse!(date, "%Y-%m-%d", :strftime)

    from(s in query, where: s.next_bill_date <= ^parsed)
  end

  defp apply_next_bill_date_lt(query, _), do: query
end
