use Mix.Config

config :appsignal, :config,
  name: System.get_env("APP_SIGNAL_NAME"),
  push_api_key: System.get_env("APP_SIGNAL_KEY"),
  env: Mix.env
