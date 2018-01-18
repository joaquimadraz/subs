use Mix.Config

config :appsignal, :config,
  name: System.get_env("APPSIGNAL_NAME"),
  push_api_key: System.get_env("APPSIGNAL_KEY"),
  env: Mix.env
