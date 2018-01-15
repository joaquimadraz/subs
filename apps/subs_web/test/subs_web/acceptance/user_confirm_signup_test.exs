defmodule SubsWeb.Test.Acceptance.UserConfirmSignupTest do
  use SubsWeb.FeatureCase

  import Wallaby.Query
  alias Subs.{User, UserRepo}
  alias Repository.Repo

  @tag :acceptance
  test "render error message when invalid token is used", %{session: session} do
    session
    |> visit("/users/confirm_signup?t=unknown")
    |> assert_has(css("#app"))
    |> assert_has(css("p", text: "Invalid token"))
  end

  @tag :acceptance
  test "signs up user successfuly and confirm user successfuly", %{session: session} do
    email = "#{UUID.uuid4()}@example.com"

    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-currency .Select-input input"), with: "GBP")
    |> click(css(".Select .Select-option"))
    |> fill_in(css("#signup-form .user-password"), with: "123456")
    |> fill_in(css("#signup-form .user-password-confirmation"), with: "123456")
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
