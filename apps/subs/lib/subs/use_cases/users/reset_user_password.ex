defmodule Subs.UseCases.Users.ResetUserPassword do
  @moduledoc false

  use Subs.UseCase
  alias Subs.{User, UserRepo}

  def perform(token, params) do
    with {:ok, user} <- find_user_by_password_recovery_token(token),
         :ok <- user_token_valid?(user) do
      ok!(%{user: user})
    else
      {:error, :invalid_token} -> failure!(:invalid_token)
      {:error, :token_expired} -> failure!(:token_expired)
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
end
