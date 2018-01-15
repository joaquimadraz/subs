require Logger

defmodule Subs.Application.DailyNotificationsBuilder do
  @moduledoc """
  This module is executed every midnight by cron.
  It gets all billable subscriptions from a day, updates it's next_bill_date
  and generates a notification to be delivered by the Notifier.

  TODO: Dunno. But I don't like this module.
  """
  alias Subs.{Subscription, SubscriptionRepo, SubsNotificationRepo}
  alias Subs.Domain.NotificationTemplate

  @dt Application.get_env(:subs, :dt)

  def build(now \\ @dt.now) do
    Logger.info "Daily notification builder is running..."

    beginning_of_day = @dt.beginning_of_day(now)
    end_of_day = @dt.end_of_day(now)
    tomorrow = @dt.step_date(beginning_of_day, :days, 1)

    # Check if there are subscriptions to calculate next_bill_date. This calculation
    # needs to happen every day before anything.
    # Example:
    #   Subscription A next_biLL_date (before calculation) 31 Dez
    #   Builder runs today (31 Dez) and needs to create a monthly (Jan) notification
    #   Subscription A needs to be on it so calculate next_bill_date first (31 Jan)
    #   Monthly notification is build with it

    # TODO: Rethink this now that needs to run every day
    SubscriptionRepo.get_billable_subscriptions(beginning_of_day, end_of_day)
    |> Enum.each(fn subscription ->
      {:ok, _subscription} = move_next_bill_date!(subscription)
    end)

    # Check what type of notification to send and ranges to get subscriptions for
    # that notification.
    now_date = NaiveDateTime.to_date(now)

    {from, to, type} =
      cond do
        now_date == @dt.end_of_month(now_date) ->
          {tomorrow, @dt.end_of_month(tomorrow), :monthly}

        now_date == @dt.end_of_week(now_date) ->
          {tomorrow, @dt.end_of_week(tomorrow), :weekly}

        true ->
          {tomorrow, @dt.end_of_day(tomorrow), :daily}
      end

    # TODO: Refactor. Try grouping from the DB?
    SubscriptionRepo.get_billable_subscriptions(from, to)
    |> Enum.reduce(%{}, fn subscription, acc ->
      Map.update(acc, subscription.user, [subscription], &(&1 ++ [subscription]))
    end)
    |> Enum.map(fn {user, subscriptions} ->
      template = NotificationTemplate.build(type, user, subscriptions, from)

      case SubsNotificationRepo.create(user, subscriptions, type, template, now) do
        {:ok, subs_notification} -> subs_notification
      end
    end)
  end

  # next_bill_date calculation is outside notification create because we maybe not
  # want to send a notification for a particular subscription.
  defp move_next_bill_date!(subscription) do
    next_bill_date =
      @dt.step_date(subscription.next_bill_date, Subscription.cycle_step(subscription), 1)

    {:ok, _subscription} =
      SubscriptionRepo.update(subscription, %{next_bill_date: next_bill_date})
  end
end
