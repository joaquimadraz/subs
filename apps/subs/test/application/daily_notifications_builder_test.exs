defmodule Subs.Test.Application.DailyNotificationsBuilderTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory
  alias Subs.Application.DailyNotificationsBuilder
  alias Subs.SubscriptionRepo

  test "creates sub notification for specific day" do
    now = ~N[2018-01-01T00:00:00Z]
    tomorrow = ~N[2018-01-02T00:00:00Z]

    user = insert(:user)

    subscription = insert(:complete_subscription, user: user, next_bill_date: tomorrow)

    insert(:complete_subscription, user: user, next_bill_date: ~N[2018-01-01T00:00:00Z])
    insert(:complete_subscription, user: user, next_bill_date: ~N[2018-01-03T00:00:00Z])

    [subs_notification] = DailyNotificationsBuilder.build(now)

    # Subs.SubsNotification was created for a particular user
    assert subs_notification.user_id == user.id
    assert subs_notification.type == :daily
    assert subs_notification.deliver_at == now

    # Notifier.Notification email was created for the user
    notification = subs_notification.notification
    assert notification.to == user.email
    assert notification.status == :pending
    assert notification.notify_at == now
    assert notification.title == "Custom Service is due tomorrow"

    assert notification.body ==
             """
             Hello,

             1 monthly payment is due tomorrow:

             Custom Service - £7.00


             See you later,
             Subs
             """

    # Only the 2018-01-01 subscription was assigned for the notification
    [assigned_subscription] = subs_notification.subscriptions
    assert subscription.id == assigned_subscription.id
  end

  test "creates single notifier.notification with multiple subscriptions" do
    now = ~N[2018-01-01T00:00:00Z]
    tomorrow = ~N[2018-01-02T00:00:00Z]

    user = insert(:user)

    insert(:complete_subscription, name: "A", user: user, next_bill_date: tomorrow)
    insert(:complete_subscription, name: "B", user: user, next_bill_date: tomorrow)

    [%{notification: notification}] = DailyNotificationsBuilder.build(now)

    assert notification.title == "A and B are due tomorrow"

    assert notification.body ==
             """
             Hello,

             2 monthly payments are due tomorrow:

             A - £7.00

             B - £7.00


             Total - £14.00


             See you later,
             Subs
             """
  end

  test "creates multiple sub notifications for different users" do
    now = ~N[2018-01-01T00:00:00Z]
    tomorrow = ~N[2018-01-02T00:00:00Z]

    user_a = insert(:user, email: "a@email.com")
    user_b = insert(:user, email: "b@email.com")

    insert(:complete_subscription, name: "A", user: user_a, next_bill_date: tomorrow)
    insert(:complete_subscription, name: "B", user: user_b, next_bill_date: tomorrow)

    [%{notification: notification_a}, %{notification: notification_b}] =
      DailyNotificationsBuilder.build(now)

    assert notification_a.to == user_a.email
    assert notification_b.to == user_b.email
  end

  test "updates subscription next_bill_date without creating notification" do
    now = ~N[2018-01-01T00:00:00Z]
    next_bill_date = ~N[2018-02-01T00:00:00Z]

    user = insert(:user)

    subscription =
      insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: now)

    # next_bill_date updated but no notitifaction created, only on 2018-01-31 there's one
    [] = DailyNotificationsBuilder.build(now)

    subscription = SubscriptionRepo.get_user_subscription(user, subscription.id)
    assert NaiveDateTime.to_date(subscription.next_bill_date) == NaiveDateTime.to_date(next_bill_date)
  end

  describe "Weekly notification" do
    setup do
      [
        # Sunday
        end_of_week: ~N[2018-01-07T00:00:00Z],
        # Tuesday following week
        next_week: ~N[2018-01-09T00:00:00Z],
        in_two_weeks: ~N[2018-01-16T00:00:00Z]
      ]
    end

    test "creates weekly subs notification with subscriptions in range", %{
      end_of_week: end_of_week,
      next_week: next_week,
      in_two_weeks: in_two_weeks
    } do
      user = insert(:user)

      insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: end_of_week)
      insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: in_two_weeks)

      subscription =
        insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: next_week)

      [subs_notification] = DailyNotificationsBuilder.build(end_of_week)

      assert subs_notification.type == :weekly

      [assigned_subscription] = subs_notification.subscriptions
      assert subscription.id == assigned_subscription.id
    end

    test "creates weekly notification", %{end_of_week: end_of_week, next_week: next_week} do
      user = insert(:user)

      subscription =
        insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: next_week)

      [%{notification: notification}] = DailyNotificationsBuilder.build(end_of_week)

      assert notification.title == subscription.name <> " is due next week"
    end
  end

  describe "Monthly notification" do
    setup do
      [
        end_of_month: ~N[2017-12-31T00:00:00Z],
        next_month: ~N[2018-01-01T00:00:00Z],
        in_two_months: ~N[2018-02-01T00:00:00Z]
      ]
    end

    test "creates weekly subs notification with subscriptions in range", %{
      end_of_month: end_of_month,
      next_month: next_month,
      in_two_months: in_two_months
    } do
      user = insert(:user)

      insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: in_two_months)

      subscription =
        insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: next_month)

      [subs_notification] = DailyNotificationsBuilder.build(end_of_month)

      assert subs_notification.type == :monthly

      [assigned_subscription] = subs_notification.subscriptions
      assert subscription.id == assigned_subscription.id
    end

    test "creates monthly notification", %{end_of_month: end_of_month, next_month: next_month} do
      user = insert(:user)

      insert(:complete_subscription, cycle: "monthly", user: user, next_bill_date: next_month)

      [%{notification: notification}] = DailyNotificationsBuilder.build(end_of_month)

      assert notification.title == "Your payments for January 2018"
    end
  end
end
