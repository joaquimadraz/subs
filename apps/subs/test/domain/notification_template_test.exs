defmodule Subs.Test.Domain.NotificationTemplateTest do
  use Subs.DataCase
  import Subs.Test.Support.Factory
  alias Subs.Domain.NotificationTemplate

  describe "Daily notification" do
    test "one monthly subscription for daily notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "A",
          cycle: "monthly",
          amount: 999,
          amount_currency_symbol: "£"
        )
      ]

      expected_title = "A is due tomorrow"

      expected_body = """
      Hello,

      1 monthly payment is due tomorrow:
      A - £9.99


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:daily, user, subscriptions)

      assert template.title == expected_title
      assert template.body == expected_body
    end

    test "multiple monthly subscriptions for daily notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "A",
          cycle: "monthly",
          amount: 999,
          amount_currency_symbol: "£"
        ),
        build(
          :complete_subscription,
          name: "B",
          cycle: "monthly",
          amount: 1250,
          amount_currency_symbol: "£"
        )
      ]

      expected_title = "A and B are due tomorrow"

      expected_body = """
      Hello,

      2 monthly payments are due tomorrow:
      A - £9.99
      B - £12.50


      Total - £22.49


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:daily, user, subscriptions)
      assert template.title == expected_title
      assert template.body == expected_body
    end

    test "more than 2 monthly subscriptions for daily notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "A",
          cycle: "monthly",
          amount: 999,
          amount_currency_symbol: "£"
        ),
        build(
          :complete_subscription,
          name: "B",
          cycle: "monthly",
          amount: 1250,
          amount_currency_symbol: "£"
        ),
        build(
          :complete_subscription,
          name: "C",
          cycle: "monthly",
          amount: 750,
          amount_currency_symbol: "£"
        )
      ]

      expected_title = "3 payments are due tomorrow"

      expected_body = """
      Hello,

      3 monthly payments are due tomorrow:
      A - £9.99
      B - £12.50
      C - £7.50


      Total - £29.99


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:daily, user, subscriptions)

      assert template.title == expected_title
      assert template.body == expected_body
    end

    test "one yearly subscription for daily notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "A",
          cycle: "yearly",
          amount: 10000,
          amount_currency_symbol: "£"
        ),
        build(
          :complete_subscription,
          name: "B",
          cycle: "monthly",
          amount: 999,
          amount_currency_symbol: "£"
        )
      ]

      expected_title = "A is due tomorrow"

      expected_body = """
      Hello,

      1 yearly payment is due tomorrow:
      A - £100.00

      1 monthly payment is due tomorrow:
      B - £9.99


      Total - £109.99


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:daily, user, subscriptions)

      assert template.title == expected_title
      assert template.body == expected_body
    end
  end

  describe "Weekly notifications" do
    test "no yearly payments for weekly notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "B",
          cycle: "monthly",
          amount: 999,
          amount_currency_symbol: "£",
          next_bill_date: ~N[2018-01-03T00:00:00Z]
        )
      ]

      expected_title = "B is due next week"

      expected_body = """
      Hello,

      Here are your payments for next week:
      B - £9.99, is due on Wednesday (2018-01-03)


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:weekly, user, subscriptions)

      assert template.title == expected_title
      assert template.body == expected_body
    end

    test "multiple subscriptions for weekly notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "A",
          cycle: "yearly",
          amount: 10000,
          amount_currency_symbol: "£",
          next_bill_date: ~N[2018-01-01T00:00:00Z]
        ),
        build(
          :complete_subscription,
          name: "B",
          cycle: "monthly",
          amount: 999,
          amount_currency_symbol: "£",
          next_bill_date: ~N[2018-01-03T00:00:00Z]
        )
      ]

      expected_title = "A is due next week"

      expected_body = """
      Hello,

      Here are your payments for next week:
      A - £100.00, is due on Monday (2018-01-01)
      B - £9.99, is due on Wednesday (2018-01-03)


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:weekly, user, subscriptions)

      assert template.title == expected_title
      assert template.body == expected_body
    end
  end

  describe "Monthly notifications" do
    test "multiple subscriptions for monthly notification" do
      user = insert(:user)

      subscriptions = [
        build(
          :complete_subscription,
          name: "R",
          cycle: "monthly",
          amount: 100_000,
          amount_currency_symbol: "£",
          next_bill_date: ~N[2018-01-01T00:00:00Z]
        ),
        build(
          :complete_subscription,
          name: "I",
          cycle: "yearly",
          amount: 20000,
          amount_currency_symbol: "£",
          next_bill_date: ~N[2018-01-31T00:00:00Z]
        )
      ]

      expected_title = "Your payments for August 2017"

      expected_body = """
      Hello,

      Next month you are spending £1200.00

      Here are your payments for next month:
      R - £1000.00, 2018-01-01
      I - £200.00, 2018-01-31


      See you later,
      Subs
      """ |> String.replace("\n", "\r\n")

      template = NotificationTemplate.build(:monthly, user, subscriptions)

      assert template.title == expected_title
      assert template.body == expected_body
    end
  end
end
