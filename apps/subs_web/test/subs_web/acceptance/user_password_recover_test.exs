defmodule SubsWeb.Test.Acceptance.UserRecoverPasswordTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  import SubsWeb.Test.Support.AcceptanceHelpers, only: [
    assert_signup: 3,
  ]

  alias Subs.{User, UserRepo}

  setup %{session: session} do
    email = "mac@example.com"

    session
    |> assert_signup(email, "123456")
    |> visit("/login")
    |> assert_has(css("#login-form"))
    |> click(button("Recover password"))
    |> assert_has(css("#recover-password-form"))
    |> fill_in(css("#recover-password-form .user-email"), with: email)
    |> click(css("#recover-password-btn"))
    |> assert_has(css("p", text: "A recover password email is on the way"))

    # Set known reset password token
    user = UserRepo.get_by_email(email)
    {:ok, user} = User.recover_password_changeset(user) |> Repo.update()

    [user: user]
  end

  @tag :acceptance
  test "renders invalid token message", %{session: session} do
    session
    |> visit("/users/reset_password?t=invalid")
    |> assert_has(css("p", text: "Token is invalid"))
  end

  @tag :acceptance
  test "renders error messages for missing passwords", %{session: session, user: user} do
    session
    |> visit("/users/reset_password?t=#{user.password_recovery_token}")
    |> assert_has(css("#reset-password-form"))
    |> fill_in(css("#reset-password-form .user-password"), with: "")
    |> fill_in(css("#reset-password-form .user-password-confirmation"), with: "")
    |> click(css("#reset-btn"))
    |> assert_has(css("li", text: "password: can't be blank"))
    |> assert_has(css("li", text: "password_confirmation: can't be blank"))
  end

  @tag :acceptance
  test "renders success message for successful password update", %{session: session, user: user} do
    session
    |> visit("/users/reset_password?t=#{user.password_recovery_token}")
    |> assert_has(css("#reset-password-form"))
    |> fill_in(css("#reset-password-form .user-password"), with: "123456")
    |> fill_in(css("#reset-password-form .user-password-confirmation"), with: "123456")
    |> click(css("#reset-btn"))
    |> assert_has(css("p", text: "Password was updated"))
  end
end
