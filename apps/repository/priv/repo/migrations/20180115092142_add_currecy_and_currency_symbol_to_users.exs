defmodule Repository.Repo.Migrations.AddCurrecyAndCurrencySymbolToUsers do
  use Ecto.Migration

  def change do
    alter table("users") do
      add :currency, :string, null: false
      add :currency_symbol, :string, null: false
    end
  end
end
