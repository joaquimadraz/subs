defmodule Subs.UseCases.Users.ResetUserPassword do
  @moduledoc false

  use Subs.UseCase
  alias Subs.{User, UserRepo}

  def perform(token, params) do
    with {:ok, user} <- find_user_by_password_recovery_token(token) do
      ok!(%{user: user})
    else
      {:error, :invalid_token} -> failure!(:invalid_token)
    end
  end

  defp find_user_by_password_recovery_token(token) do
    case UserRepo.get_by_password_recovery_token(token) do
      nil -> {:error, :invalid_token}
      user -> {:ok, user}
    end
  end
end
