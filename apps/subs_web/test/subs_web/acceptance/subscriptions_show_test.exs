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
end
