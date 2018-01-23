defmodule SubsWeb.Test.Acceptance.OverviewPageTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup_and_login_user: 1,
  ]

  @tag :acceptance
  test "renders add new payment message and hides due section", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/")
    |> assert_has_no_table_headers(".NextSubscriptions")
    |> assert_has(css(".no-payments-cta", with: "You have no payments. Click here to add one."))
    |> assert_has(css(".DueSubscriptions", count: 0))
  end

  @tag :acceptance
  test "renders current month and total", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/")
    |> assert_has(css(".CurrentMonthStats--year", text: "2017"))
    |> assert_has(css(".CurrentMonthStats--month", text: "AUGUST"))
    |> assert_has(css(".CurrentMonthStats--total", text: "£0"))
  end

  @tag :acceptance
  test "renders next monthly payments on next section and due on due section", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Next")
    |> fill_in(css("#subscription-form .subscription-first-bill-date input"), with: "31/01/2017")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Due")
    |> fill_in(css("#subscription-form .subscription-first-bill-date input"), with: "01/01/2017")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> visit("/")
    |> assert_has_table_headers(".NextSubscriptions")
    |> assert_has(css(".NextSubscriptions .SubscriptionListItem--name", text: "Next"))
    |> assert_has(css(".NextSubscriptions .SubscriptionListItem--next-bill-date", text: "31/08/2017"))
    |> assert_has_no_table_headers(".DueSubscriptions")
    |> assert_has(css(".DueSubscriptions .SubscriptionListItem--name", text: "Due"))
    |> assert_has(css(".DueSubscriptions .SubscriptionListItem--next-bill-date", text: "01/08/2017"))
  end

  @tag :acceptance
  test "renders only due payments", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Github")
    |> fill_in(css("#subscription-form .subscription-first-bill-date input"), with: "01/01/2017")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Netflix")
    |> fill_in(css("#subscription-form .subscription-first-bill-date input"), with: "01/01/2017")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> visit("/")
    |> assert_has(css(".NextSubscriptions", count: 0))
    |> assert_has_table_headers(".DueSubscriptions")
    |> assert_has(css(".DueSubscriptions .SubscriptionListItem", count: 2))
  end

  defp assert_has_no_table_headers(session, container) do
    session
    |> assert_has(css("#{container} .header", count: 0))
  end

  defp assert_has_table_headers(session, container) do
    session
    |> assert_has(css("#{container} .header", text: "Payment"))
    |> assert_has(css("#{container} .header", text: "Cycle"))
    |> assert_has(css("#{container} .header", text: "Bill date"))
    |> assert_has(css("#{container} .header", text: "Amount"))
  end
end
