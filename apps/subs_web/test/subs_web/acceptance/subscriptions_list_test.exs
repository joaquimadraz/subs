defmodule SubsWeb.Test.Acceptance.SubscriptionsListTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup_and_login_user: 1,
  ]

  @tag :acceptance
  test "renders add new payment message", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments")
    |> assert_has(css(".no-payments-cta", with: "You have no payments. Click here to add one."))
  end

  @tag :acceptance
  test "adds new subscription and updates averages", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Dropbox")
    |> fill_in(css("#subscription-form .subscription-amount"), with: "1")
    |> fill_in(css("#subscription-form .subscription-cycle"), with: "monthly")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> visit("/payments")
    |> assert_has(css(".Subscriptions--monthly-avg", text: "£1.00"))
    |> assert_has(css(".Subscriptions--yearly-avg", text: "£12.00"))
  end
end
