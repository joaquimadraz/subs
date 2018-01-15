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
    |> visit("/subscriptions/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "Dropbox")
    |> fill_in(css("#subscription-form .subscription-amount"), with: "1")
    |> fill_in(css("#subscription-form .subscription-cycle"), with: "yearly")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> assert_has(css("h3", text: "Payments"))
    |> assert_has(css(".SubscriptionListItem--name", text: "Dropbox"))
    |> click(css(".SubscriptionListItem--name"))
    |> click(css(".SubscriptionListItem--archive-button"))
    |> find(css(".SubscriptionListItem", count: 0))
  end
end
