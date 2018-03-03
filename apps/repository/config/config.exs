use Mix.Config

config :repository, ecto_repos: [Repository.Repo]

import_config "#{Mix.env}.exs"
