defmodule Repository.Repo.Migrations.RemotePasswordRecoveryUsedAtOnUsers do
  use Ecto.Migration

  def change do
    alter table("users") do
      remove :password_recovery_used_at
    end
  end
end
