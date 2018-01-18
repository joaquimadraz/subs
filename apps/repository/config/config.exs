use Mix.Config

config :repository, ecto_repos: [Repository.Repo]

config :repository, Repository.Repo,
  loggers: [Appsignal.Ecto, Ecto.LogEntry]

import_config "#{Mix.env}.exs"
