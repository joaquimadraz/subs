defmodule Repository.Repo.Migrations.AddTypeAndTypeDescriptionToSubscriptions do
  use Ecto.Migration

  def change do
    alter table("subscriptions") do
      add(:type, :string)
      add(:type_description, :string)
    end
  end
end
