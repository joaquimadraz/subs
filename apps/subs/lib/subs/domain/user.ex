defmodule Subs.User do
  @moduledoc false

  use Subs.Schema
  alias Subs.UserRepo

  @bcrypt Application.get_env(:subs, :bcrypt)

  schema "users" do
    field :name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :encrypted_password, :string

    timestamps()
  end

  @required_create_fields ~w(email password password_confirmation)a
  @required_update_fields ~w(password password_confirmation)a
  @optional_fields ~w(name)a
  @email_regex ~r/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_create_fields ++ @optional_fields)
    |> validate_required(@required_create_fields)
    |> downcase_email
    |> validate_format(:email, @email_regex)
    |> validate_length(:name, min: 3)
    |> validate_length(:password, min: 6)
    |> validate_password_confirmation_presence
    |> validate_confirmation(:password)
    |> unique_constraint(:email)
    |> encrypt_password
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_update_fields ++ @optional_fields)
    |> validate_length(:name, min: 3)
    |> validate_length(:password, min: 6)
    |> validate_password_confirmation_presence
    |> validate_confirmation(:password)
    |> encrypt_password
  end

  def authenticate(email, password) do
    user = UserRepo.get_by_email(email)

    case user do
      nil ->
        invalid_password()
      user ->
        valid_password?(user, password)
    end
  end

  defp valid_password?(user, password) do
    if @bcrypt.checkpw(password, user.encrypted_password) do
      {:ok, user}
    else
      :error
    end
  end

  defp invalid_password do
    # Add delay to prevent timing attacks
    @bcrypt.dummy_checkpw()
    :error
  end

  defp downcase_email(changeset) do
    case get_change(changeset, :email) do
      nil ->
        changeset
      email ->
        put_change(changeset, :email, String.downcase(email))
    end
  end

  defp encrypt_password(changeset) do
    case get_change(changeset, :password) do
      nil ->
        changeset
      plain_text_password ->
        encrypted_password = @bcrypt.hashpwsalt(plain_text_password)

        put_change(changeset, :encrypted_password, encrypted_password)
    end
  end

  defp validate_password_confirmation_presence(changeset) do
    password = get_change(changeset, :password)
    password_confirmation = get_change(changeset, :password_confirmation)

    if password && !password_confirmation do
      add_error(changeset, :password_confirmation, "can't be blank")
    else
      changeset
    end
  end
end