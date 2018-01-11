defmodule SubsWeb.Test.Acceptance.UserRecoverPasswordTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query

  alias Subs.{User, UserRepo}

  setup %{session: session} do
    email = "mac@example.com"

    session
    |> assert_signup_and_login_user(email)
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

  defp assert_signup_and_login_user(session, email) do
    password = "123456"

    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-password"), with: password)
    |> fill_in(css("#signup-form .user-password-confirmation"), with: password)
    |> click(css("#signup-btn"))
    |> assert_has(css("p", text: "A confirmation email was sent to #{email}."))

    # Set known confirmation token
    user = UserRepo.get_by_email(email)
    {:ok, user} = User.confirmation_changeset(user) |> Repo.update()

    session
    |> visit("/users/confirm_signup?t=#{user.confirmation_token}")
    |> assert_has(css("#app"))
    |> assert_has(css("p", text: "Account confirmed, ready to login"))
  end
end
