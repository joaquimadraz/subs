# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :subs_web,
  namespace: SubsWeb,
  ecto_repos: [Repository.Repo]

# Configures the endpoint
config :subs_web, SubsWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Dfm/Op55x+WSaLetz1BJ0CMaHNoeuRXV0UP238OH9FfTrsb/wop2dHaRmfW+i59y",
  render_errors: [view: SubsWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: SubsWeb.PubSub, adapter: Phoenix.PubSub.PG2],
  instrumenters: [Appsignal.Phoenix.Instrumenter]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :subs_web, :generators,
  context_app: :subs

config :subs_web, SubsWeb.Guardian,
  issuer: "SubsWeb",
  secret_key: "guardian_secret"

config :subs_web, SubsWeb.Helpers.AuthAccessPipeline,
  module: SubsWeb.Guardian,
  error_handler: SubsWeb.Helpers.AuthErrorHandler

config :subs_web, :subs_services, SubsServices

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
