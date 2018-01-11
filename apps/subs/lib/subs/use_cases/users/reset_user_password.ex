defmodule Subs.UseCases.Users.ResetUserPassword do
  @moduledoc false

  use Subs.UseCase
  alias Subs.{User, UserRepo}

  def perform(token, params) do
    with {:ok, user} <- find_user_by_password_recovery_token(token),
         :ok <- user_token_valid?(user),
         {:ok, user} <- update_password(user, params) do
      ok!(%{user: user})
    else
      {:error, :invalid_token} ->
        failure!(:invalid_token)
      {:error, :token_expired} ->
        failure!(:token_expired)
      {:error, :invalid_params, changeset} ->
        failure!(:invalid_params, %{changeset: changeset})
    end
  end

  defp find_user_by_password_recovery_token(token) do
    case UserRepo.get_by_password_recovery_token(token) do
      nil -> {:error, :invalid_token}
      user -> {:ok, user}
    end
  end

  defp user_token_valid?(user) do
    if User.reset_password?(user),
      do: :ok,
      else: {:error, :token_expired}
  end

  defp update_password(user, params) do
    case UserRepo.reset_password(user, params) do
      {:ok, user} ->
        {:ok, user}
      {:error, changeset} ->
        {:error, :invalid_params, changeset}
    end
  end
end
