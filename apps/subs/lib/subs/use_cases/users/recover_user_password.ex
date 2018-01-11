defmodule Subs.UseCases.Users.RecoverUserPassword do
  @moduledoc false

  use Subs.UseCase
  alias Subs.{User, UserRepo}

  def perform(email) do
    with {:ok, email} <- validate_email(email),
         {:ok, user} <- find_user_by_email(email),
         {:ok, user} <- reset_password_fields(user) do
      ok!(%{user: user})
    else
      {:error, :user_not_found} -> failure!(:user_not_found)
      {:error, changeset} ->  failure!(:invalid_email, %{changeset: changeset})
    end
  end

  defp validate_email(email) do
    changeset = User.email_changeset(%User{}, %{"email" => email})

    if changeset.valid? do
      {:ok, email}
    else
      {:error, changeset}
    end
  end

  defp reset_password_fields(user) do
    UserRepo.reset_user_recover_password_fields(user)
  end

  defp find_user_by_email(email) do
    case UserRepo.get_by_email(email) do
      nil -> {:error, :user_not_found}
      user -> {:ok, user}
    end
  end
end
