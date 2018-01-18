defmodule SubsWeb.Test.Acceptance.SubscriptionsShowTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup_and_login_user: 1,
  ]

  @tag :acceptance
  test "redirects to 404 for unknown subscription", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments/1")
    |> assert_has(css("h3", text: "404 Page not found"))
  end

  @tag :acceptance
  test "updates subscription and updates averages", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Dropbox")
    |> fill_in(css("#subscription-form .subscription-amount"), with: "1")
    |> fill_in(css("#subscription-form .subscription-cycle"), with: "monthly")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> assert_has(css(".Subscriptions--monthly-avg", text: "£1.00"))
    |> assert_has(css(".Subscriptions--yearly-avg", text: "£12.00"))
    |> click(css(".SubscriptionListItem--name"))
    |> fill_in(css("#subscription-form .subscription-amount"), with: "2")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> assert_has(css(".Subscriptions--monthly-avg", text: "£2.00"))
    |> assert_has(css(".Subscriptions--yearly-avg", text: "£24.00"))
  end
end
