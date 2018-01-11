defmodule SubsWeb.Api.ResetPasswordController do
  use SubsWeb, :controller

  alias Subs.UseCases.Passwords.CheckRecoveryToken
  alias SubsWeb.Api.ErrorView

  def show(conn, params = %{"t" => token}) do
    case CheckRecoveryToken.perform(token) do
      {:ok, _} ->
        send_resp(conn, :accepted, "")
      {:error, {:invalid_token, _}} ->
        conn
        |> put_status(:conflict)
        |> render(ErrorView, :"409", message: "Token is invalid")
      {:error, {:token_expired, _}} ->
        conn
        |> put_status(:conflict)
        |> render(ErrorView, :"409", message: "Token has expired")
    end
  end
  def show(conn, _params) do
    conn
    |> put_status(:conflict)
    |> render(ErrorView, :"409", message: "Token is invalid")
  end
end
