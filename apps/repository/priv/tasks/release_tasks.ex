defmodule Repository.Tasks.ReleaseTasks do
  @start_apps [
    :postgrex,
    :ecto
  ]

  def setup do
    boot(:repository)
    Repository.Repo.__adapter__.storage_up(Repository.Repo.config)
    {:ok, _ } = Repository.Repo.start_link(pool_size: 1)
    run_migrations_for(:repository)
    run_seeds_for(:repository)
  end

  def migrate do
    boot(:repository)
    {:ok, _ } = Repository.Repo.start_link(pool_size: 1)
    run_migrations_for(:repository)
  end

  defp boot(app) do
    IO.puts "Booting pre hook..."
    # Load app without starting it
    :ok = Application.load(app)
    # Ensure postgrex and ecto for migrations and seed
    Enum.each(@start_apps, &Application.ensure_all_started/1)
  end

  defp run_migrations_for(app) do
    IO.puts "Running migrations..."
    Ecto.Migrator.run(Repository.Repo, migrations_path(app), :up, all: true)
  end

  defp run_seeds_for(app) do
    # Run the seed script if it exists
    seed_script = Path.join([priv_dir(app), "repo", "seeds.exs"])
    if File.exists?(seed_script) do
      IO.puts "Running seed script..."
      Code.eval_file(seed_script)
    end
  end

  defp migrations_path(app), do: Path.join([priv_dir(app), "repo", "migrations"])

  defp seed_path(app), do: Path.join([priv_dir(app), "repo", "seeds.exs"])

  defp priv_dir(app), do: "#{:code.priv_dir(app)}"
end
