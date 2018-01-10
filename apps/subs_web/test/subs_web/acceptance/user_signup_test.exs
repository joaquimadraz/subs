defmodule SubsWeb.Test.Acceptance.UserSignupTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query

  @tag :acceptance
  test "renders errors when submitting an empty form", %{session: session} do
    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: "")
    |> fill_in(css("#signup-form .user-password"), with: "")
    |> fill_in(css("#signup-form .user-password-confirmation"), with: "")
    |> click(css("#signup-btn"))
    |> assert_has(css("li", text: "email: can't be blank"))
    |> assert_has(css("li", text: "password: can't be blank"))
    |> assert_has(css("li", text: "password_confirmation: can't be blank"))
  end

  @tag :acceptance
  test "renders already taken error for registered email", %{session: session} do
    email = "#{UUID.uuid4()}@example.com"

    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-password"), with: "123456")
    |> fill_in(css("#signup-form .user-password-confirmation"), with: "123456")
    |> click(css("#signup-btn"))
    |> visit("/signup")
    |> assert_has(css("#signup-form"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-password"), with: "123456")
    |> fill_in(css("#signup-form .user-password-confirmation"), with: "123456")
    |> click(css("#signup-btn"))
    |> assert_has(css("li", text: "email: has already been taken"))
  end

  @tag :acceptance
  test "signs up with success and renders confirmation message", %{session: session} do
    email = "#{UUID.uuid4()}@example.com"

    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-password"), with: "123456")
    |> fill_in(css("#signup-form .user-password-confirmation"), with: "123456")
    |> click(css("#signup-btn"))
    |> assert_has(css("p", text: "A confirmation email was sent to #{email}."))
  end

  @tag :acceptance
  test "signs up with success renders confirmation message and next signup is clear", %{session: session} do
    email = "#{UUID.uuid4()}@example.com"

    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-password"), with: "123456")
    |> fill_in(css("#signup-form .user-password-confirmation"), with: "123456")
    |> click(css("#signup-btn"))
    |> assert_has(css("p", text: "A confirmation email was sent to #{email}."))
    |> click(css("a[href='/login']"))
    |> click(css("a[href='/signup']"))
    |> assert_has(css("#signup-form .user-email", text: ""))
  end
end
