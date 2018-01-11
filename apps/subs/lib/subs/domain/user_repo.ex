defmodule Subs.UserRepo do
  @moduledoc false
  import Ecto.Query

  alias Subs.User
  alias Repository.Repo
  alias Subs.Helpers.Crypto

  def create(params) do
    %User{}
    |> User.create_changeset(params)
    |> Repo.insert
  end

  def update(user, params) do
    user
    |> User.update_changeset(params)
    |> Repo.update()
  end

  def reset_password(user, params) do
    user
    |> User.reset_password_changeset(params)
    |> Repo.update()
  end

  def delete(user) do
    Repo.delete(user)
  end

  def get_by_email(email) do
    Repo.get_by(User, email: String.downcase(email))
  end

  def get_confirmed_by_email(email) do
    query =
      from(
        u in User,
        where: not(is_nil(u.confirmed_at)) and u.email == ^email
      )

    Repo.one(query)
  end

  def get_by_id(user_id), do: Repo.get(User, user_id)

  def get_by_confirmation_token(token) do
    Repo.get_by(User, encrypted_confirmation_token: Crypto.sha1(token))
  end

  def get_by_password_recovery_token(token) do
    Repo.get_by(User, encrypted_password_recovery_token: Crypto.sha1(token))
  end

  def reset_user_recover_password_fields(user) do
    user
    |> User.recover_password_changeset()
    |> Repo.update()
  end
end
