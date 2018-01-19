use Mix.Config

config :notifier, Notifier.Scheduler,
  jobs: [
    # Every day at 1am
    {"0 1 * * *", {Notifier, :deliver_notifications, []}},
  ]

config :notifier, Notifier.Mailer,
  adapter: Bamboo.SendgridAdapter,
  api_key: System.get_env("SENDGRID_API_KEY")

config :notifier,
  :from_email, System.get_env("SUBS_ADMIN_EMAIL")
