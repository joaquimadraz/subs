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
end
