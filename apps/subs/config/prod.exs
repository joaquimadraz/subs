use Mix.Config

config :subs, Subs.Scheduler,
  jobs: [
    # Every midnight
    {"@daily", {Subs.Application.DailyNotificationsBuilder, :build, []}},
  ]
