# TODO: Investigate
# > cannot use ExUnit.Case without starting the ExUnit application,
#   please call ExUnit.start() or explicitly start the :ex_unit app
:ok = Application.ensure_started(:ex_unit)

defmodule SubsWeb.Test.Support.AcceptanceHelpers do
  @moduledoc false
  use SubsWeb.FeatureCase
  import Wallaby.Query

  alias Subs.{User, UserRepo}

  def assert_signup(session, email, password) do
    session
    |> visit("/signup")
    |> assert_has(css("#app"))
    |> fill_in(css("#signup-form .user-email"), with: email)
    |> fill_in(css("#signup-form .user-currency .Select-input input"), with: "GBP")
    |> click(css("#signup-form .user-currency .Select-option"))
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

  def assert_signup_and_login_user(session, email \\ "joaquim@example.com") do
    password = "123456"

    session
    |> assert_signup(email, password)
    |> visit("/login")
    |> assert_has(css("#login-form"))
    |> fill_in(css("#login-form .user-email"), with: email)
    |> fill_in(css("#login-form .user-password"), with: password)
    |> click(css("#login-btn"))
    |> assert_has(css(".Header--menu-trigger"))

    session
  end
end
