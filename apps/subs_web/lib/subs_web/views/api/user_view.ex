defmodule SubsWeb.Api.UserView do
  use SubsWeb, :view
  alias SubsWeb.Api.UserView

  def render("authenticate.json", %{user: user, auth_token: auth_token}) do
    %{
      data: render_one(user, UserView, "user.json"),
      meta: %{
        auth_token: auth_token
      }
    }
  end

  def render("create.json", %{user: user}) do
    data =
      user
      |> render_one(UserView, "user.json")
      |> Map.put(:confirmation_sent_at, user.confirmation_sent_at)

    %{
      data: data,
      meta: %{}
    }
  end

  def render("confirm.json", %{user: user}) do
    render_one(user, UserView, "show.json")
  end

  def render("recover_password.json", _) do
    %{message: "A recover password email is on the way"}
  end

  def render("reset_password.json", _) do
    %{message: "Password was updated"}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      name: user.name,
      email: user.email
    }
  end
end
