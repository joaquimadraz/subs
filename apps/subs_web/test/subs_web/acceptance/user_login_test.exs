defmodule SubsWeb.Test.Acceptance.UserLoginTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup_and_login_user: 1,
    assert_signup_and_login_user: 2
  ]

  @tag :acceptance
  test "render error message when login fails", %{session: session} do
    session
    |> visit("/login")
    |> assert_has(css("#login-form"))
    |> fill_in(css("#login-form .user-email"), with: "unexisting")
    |> fill_in(css("#login-form .user-password"), with: "nope")
    |> click(css("#login-btn"))
    |> assert_has(css("p", text: "Invalid credentials"))
  end

  @tag :acceptance
  test "visit login page, clicks recover password and back to login", %{session: session} do
    session
    |> visit("/login")
    |> assert_has(button("Recover password"))
    |> click(button("Recover password"))

    assert has_no_css?(session, "#login-form")

    session
    |> assert_has(css("#recover-password-form"))
    |> click(button("Cancel"))
    |> assert_has(css("#login-form"))

    assert has_no_css?(session, "#recover-password-form")
  end

  @tag :acceptance
  test "visits recover password form and get error for invalid email", %{session: session} do
    session
    |> visit("/login")
    |> assert_has(button("Recover password"))
    |> click(button("Recover password"))
    |> fill_in(css("#recover-password-form .user-email"), with: "invalid")
    |> click(css("#recover-password-btn"))
    |> assert_has(css("li", text: "email: has invalid format"))
  end

  @tag :acceptance
  test "visits recover password form and recovers with success", %{session: session} do
    email = "jonjones@example.com"

    session
    |> visit("/login")
    |> assert_has(button("Recover password"))
    |> click(button("Recover password"))
    |> fill_in(css("#recover-password-form .user-email"), with: email)
    |> click(css("#recover-password-btn"))
    |> assert_has(css("p", text: "A recover password email is on the way"))
  end

  @tag :acceptance
  test "login successful and redirects to root page with email rendered", %{session: session} do
    assert_signup_and_login_user(session)
  end

  @tag :acceptance
  test "login successful and full refresh keeps user logged", %{session: session} do
    email = "joaquim@example.com"
    session
    |> assert_signup_and_login_user(email)
    |> visit("/")
    |> assert_has(css(".logout-btn"))
  end

  @tag :acceptance
  test "logout successful", %{session: session} do
    session
    |> assert_signup_and_login_user()
    |> click(css(".logout-btn"))
    |> assert_has(css("#login-btn"))
    |> visit("/")
    |> assert_has(css("#login-btn"))
  end
end
