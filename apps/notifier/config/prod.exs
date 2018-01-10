use Mix.Config

config :notifier, Notifier.Scheduler,
  jobs: [
    # Every day at 1am
    {"0 0 1 * *", {Notifier, :deliver_notifications, []}},
  ]

config :notifier, Notifier.Mailer,
  adapter: Bamboo.SendgridAdapter,
  api_key: "my_api_key"

config :notifier,
  :from_email, System.get_env("SUBS_ADMIN_EMAIL")

import_config "prod.secrets.exs"
