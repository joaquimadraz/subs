defmodule SubsWeb.Test.Acceptance.ArchiveSubscriptionTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup_and_login_user: 1,
  ]

  @tag :acceptance
  test "archives subscription and removes it from the list", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/payments/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Dropbox")
    |> fill_in(css("#subscription-form .subscription-amount"), with: "1")
    |> fill_in(css("#subscription-form .subscription-cycle"), with: "yearly")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> assert_has(css("a", text: "New payment"))
    |> assert_has(css(".SubscriptionListItem--name", text: "Dropbox"))
    |> click(css(".SubscriptionListItem--name"))
    |> click(css(".SubscriptionListItem--archive-button"))
    |> find(css(".SubscriptionListItem", count: 0))
  end

  @tag :acceptance
  test "archives subscription and updates averages", %{session: session} do
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
    |> click(css(".SubscriptionListItem--archive-button"))
    |> assert_has(css(".Subscriptions--monthly-avg", text: "£0.00"))
    |> assert_has(css(".Subscriptions--yearly-avg", text: "£0.00"))
  end
end
