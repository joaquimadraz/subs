defmodule SubsWeb.Test.Acceptance.SubscriptionsNewTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup_and_login_user: 1,
  ]

  @tag :acceptance
  test "redirects to login if trying to access subscriptions new page when user is not logged", %{session: session} do
    session
    |> visit("/subscriptions/new")
    |> assert_has(css("#login-form"))
  end

  @tag :acceptance
  test "loads new subcription page when user is logged", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/subscriptions/new")
    |> assert_has(css("#subscription-form"))
  end

  @tag :acceptance
  test "renders errors when submitting an empty form", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/subscriptions/new")
    |> assert_has(css("#subscription-form"))
    |> fill_in(css("#subscription-form .subscription-name"), with: "")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> assert_has(css("li", text: "name: can't be blank"))
  end

  @tag :acceptance
  test "creates subscription and renders it on the page", %{session: session} do
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
  end

  @tag :acceptance
  test "creates subscription from service and renders it on the page", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> visit("/subscriptions/new")
    |> assert_has(css("#subscription-form"))
    |> click(css("#subscription-form .subscription-service"))
    |> click(css(".Select .Select-option:first-child"))
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> assert_has(css("h3", text: "Payments"))
    |> assert_has(css(".SubscriptionListItem--name", text: "Github"))
  end

  @tag :acceptance
  test "creates custom subscription and updates amount", %{session: session} do
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
    |> click(css(".SubscriptionListItem a"))
    |> fill_in(css("#subscription-form .subscription-amount"), with: "2")
    |> click(css("#subscription-form button[type=\"submit\"]"))
    |> visit("/subscriptions")
    |> assert_has(css(".SubscriptionListItem--amount", text: "£2"))
  end
end
