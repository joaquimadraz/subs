defmodule Notifier.Mixfile do
  use Mix.Project

  def project do
    [
      app: :notifier,
      version: "0.1.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.5",
      elixirc_paths: elixirc_paths(Mix.env),
      start_permanent: Mix.env == :prod,
      deps: deps(),
      aliases: aliases(),
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Notifier.Application, []}
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_),     do: ["lib"]

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:ecto_enum, "~> 1.0"},
      {:bamboo, "~> 0.8"},
      {:bamboo_smtp, "~> 1.4.0", only: :dev},
      {:quantum, ">= 2.2.1"},
      {:timex, "~> 3.0"},
      {:ex_machina, "~> 2.0", only: :test},
      {:repository, in_umbrella: true},
      {:mox, "~> 0.3.0", only: :test},
    ]
  end

  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      "test": ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
