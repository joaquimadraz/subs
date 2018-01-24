defmodule SubsWeb.Api.SubscriptionView do
  use SubsWeb, :view
  alias Subs.Helpers.Money
  alias SubsWeb.Api.SubscriptionView

  def render("index.json", %{subscriptions: subscriptions, month_stats: month_stats}) do
    %{
      data: render_many(subscriptions, SubscriptionView, "subscription.json"),
      meta: %{
        avg: %{
          monthly: calculate_monthly_avg(subscriptions),
          yearly: calculate_yearly_avg(subscriptions),
        },
        prev: %{
          subscriptions: render_many(month_stats[:prev][:payments], SubscriptionView, "current_subscription.json"),
          total: amount_to_human(month_stats[:prev][:total])
        },
        month: %{
          subscriptions: render_many(month_stats[:curr][:payments], SubscriptionView, "current_subscription.json"),
          total: amount_to_human(month_stats[:curr][:total])
        },
        next: %{
          subscriptions: render_many(month_stats[:next][:payments], SubscriptionView, "current_subscription.json"),
          total: amount_to_human(month_stats[:next][:total])
        }
      }
    }
  end

  def render("created.json", %{subscription: subscription}) do
    %{
      data: render_one(subscription, SubscriptionView, "subscription.json"),
      meta: %{}
    }
  end

  def render("updated.json", %{subscription: subscription}) do
    %{
      data: render_one(subscription, SubscriptionView, "subscription.json"),
      meta: %{}
    }
  end

  def render("show.json", %{subscription: subscription}) do
    %{
      data: render_one(subscription, SubscriptionView, "subscription.json"),
      meta: %{}
    }
  end

  def render("subscription.json", %{subscription: subscription}) do
    %{
      id: subscription.id,
      name: subscription.name,
      description: subscription.description,
      amount: amount_to_human(subscription.amount),
      amount_currency: subscription.amount_currency,
      amount_currency_symbol: subscription.amount_currency_symbol,
      cycle: subscription.cycle,
      color: subscription.color,
      first_bill_date: naive_to_utc_iso8601(subscription.first_bill_date),
      next_bill_date: naive_to_utc_iso8601(subscription.next_bill_date),
      service_code: subscription.service_code,
      type: subscription.type,
      type_description: subscription.type_description,
    }
  end

  def render("current_subscription.json", %{subscription: subscription}) do
    %{
      id: subscription.id,
      name: subscription.name,
      description: subscription.description,
      amount: amount_to_human(subscription.amount),
      amount_currency: subscription.amount_currency,
      amount_currency_symbol: subscription.amount_currency_symbol,
      cycle: subscription.cycle,
      color: subscription.color,
      first_bill_date: naive_to_utc_iso8601(subscription.first_bill_date),
      next_bill_date: naive_to_utc_iso8601(subscription.next_bill_date),
      current_bill_date: naive_to_utc_iso8601(subscription.current_bill_date),
      service_code: subscription.service_code,
      type: subscription.type,
      type_description: subscription.type_description,
    }
  end

  defp amount_to_human(amount), do: Money.to_human(amount)

  defp naive_to_utc_iso8601(date) do
    DateTime.from_naive!(date, "Etc/UTC") |> DateTime.to_iso8601()
  end

  # TODO: Refactor. Convert amounts to user currency. One iteration for both calculations.
  defp calculate_monthly_avg(subscriptions) do
    montly_avg =
      subscriptions
      |> Enum.filter(fn(subscription) -> subscription.cycle == "monthly" end)
      |> Enum.reduce(0.0, fn(subscription, acc) -> acc + subscription.amount end)

    yearly_avg =
      subscriptions
      |> Enum.filter(fn(subscription) -> subscription.cycle == "yearly" end)
      |> Enum.reduce(0.0, fn(subscription, acc) -> acc + subscription.amount / 12.0 end)

    amount_to_human(montly_avg + yearly_avg)
  end

  defp calculate_yearly_avg(subscriptions) do
    montly_avg =
      subscriptions
      |> Enum.filter(fn(subscription) -> subscription.cycle == "monthly" end)
      |> Enum.reduce(0.0, fn(subscription, acc) -> acc + subscription.amount * 12.0 end)

    yearly_avg =
      subscriptions
      |> Enum.filter(fn(subscription) -> subscription.cycle == "yearly" end)
      |> Enum.reduce(0.0, fn(subscription, acc) -> acc + subscription.amount end)

    amount_to_human(montly_avg + yearly_avg)
  end
end
