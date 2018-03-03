defmodule SubsWeb.Router do
  use SubsWeb, :router
  use Plug.ErrorHandler

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticated do
    plug SubsWeb.Helpers.AuthAccessPipeline
  end

  scope "/api", SubsWeb, as: :api do
    pipe_through :api

    resources "/users", Api.UserController, only: [:create]

    scope "/users", as: :user do
      post "/authenticate", Api.UserController, :authenticate, as: :authenticate
      post "/confirm", Api.UserController, :confirm, as: :confirm
      post "/recover_password", Api.UserController, :recover_password, as: :recover_password
      post "/reset_password", Api.UserController, :reset_password, as: :reset_password
    end

    get "/password/reset", Api.ResetPasswordController, :show
  end

  scope "/api", SubsWeb, as: :api do
    pipe_through [:api, :authenticated]

    resources "/subscriptions", Api.SubscriptionController, only: [:index, :create, :show, :update]
    resources "/services", Api.ServiceController, only: [:index]

    scope "/users", as: :user do
      get "/me", Api.UserController, :me, as: :me
    end
  end

  scope "/", SubsWeb do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  defp handle_errors(conn, %{kind: kind, reason: reason, stack: stacktrace}) do
    SubsWeb.RollbaxHelper.report(conn, kind, reason, stacktrace)
  end
end
