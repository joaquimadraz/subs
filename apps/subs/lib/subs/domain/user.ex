defmodule Subs.User do
  @moduledoc false

  use Subs.Schema
  alias Subs.{Subscription, UserRepo, SubsNotification}
  alias Subs.Helpers.{Crypto, Money}

  @bcrypt Application.get_env(:subs, :bcrypt)
  @dt Application.get_env(:subs, :dt)

  schema "users" do
    field :name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :encrypted_password, :string
    field :confirmation_token, :string, virtual: true
    field :encrypted_confirmation_token, :string
    field :confirmation_sent_at, :naive_datetime
    field :confirmed_at, :naive_datetime
    field :password_recovery_token, :string, virtual: true
    field :encrypted_password_recovery_token, :string
    field :password_recovery_expires_at, :naive_datetime
    field :currency, :string
    field :currency_symbol, :string

    has_many :subscriptions, Subscription
    has_many :subs_notifications, SubsNotification

    timestamps()
  end

  @required_create_fields ~w(email
                             password
                             password_confirmation
                             currency)a

  @required_update_fields ~w(password
                             password_confirmation
                             confirmation_sent_at
                             confirmed_at)a

  @optional_fields ~w(name currency)a

  @email_regex ~r/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/

  def create_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_create_fields ++ @optional_fields)
    |> validate_required(@required_create_fields)
    |> downcase_email()
    |> validate_format(:email, @email_regex)
    |> validate_length(:name, min: 3)
    |> validate_length(:password, min: 6)
    |> validate_password_confirmation_presence()
    |> validate_confirmation(:password)
    |> unique_constraint(:email)
    |> validate_inclusion(:currency, Money.currency_codes())
    |> populate_currency_symbol()
    |> encrypt_password()
    |> confirmation_changeset()
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_update_fields ++ @optional_fields)
    |> validate_length(:name, min: 3)
    |> validate_length(:password, min: 6)
    |> validate_password_confirmation_presence()
    |> validate_confirmation(:password)
    |> validate_inclusion(:currency, Money.currency_codes())
    |> populate_currency_symbol()
    |> encrypt_password()
  end

  def confirmation_changeset(struct) do
    confirmation_token = UUID.uuid4(:hex)

    change(struct, confirmation_token: confirmation_token,
                   encrypted_confirmation_token: Crypto.sha1(confirmation_token),
                   confirmation_sent_at: nil,
                   confirmed_at: nil)
  end

  def recover_password_changeset(struct, dt \\ @dt) do
    password_recovery_token = UUID.uuid4(:hex)

    change(struct, password_recovery_token: password_recovery_token,
                   encrypted_password_recovery_token: Crypto.sha1(password_recovery_token),
                   password_recovery_expires_at: dt.step_date(dt.now(), :hours, 1))
  end

  def reset_password?(nil), do: false
  def reset_password?(user) do
    user.encrypted_password_recovery_token &&
      @dt.minutes_between(user.password_recovery_expires_at, @dt.now()) >= 0
  end

  def reset_password_changeset(user, params) do
    required_field = ~w(password password_confirmation)a

    user
    |> cast(params, required_field)
    |> validate_required(required_field)
    |> validate_length(:password, min: 6)
    |> validate_password_confirmation_presence()
    |> validate_confirmation(:password)
    |> encrypt_password()
    |> change(encrypted_password_recovery_token: nil, password_recovery_expires_at: nil)
  end

  def email_changeset(struct, params) do
    struct
    |> cast(params, [:email])
    |> downcase_email()
    |> validate_format(:email, @email_regex)
  end

  def authenticate(email, password) do
    user = UserRepo.get_confirmed_by_email(email)

    case user do
      nil ->
        invalid_password()
      user ->
        valid_password?(user, password)
    end
  end

  def confirmed?(user) do
    user.confirmed_at != nil
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

  defp populate_currency_symbol(changeset) do
    case get_change(changeset, :currency) do
      nil ->
        changeset
      currency ->
        put_change(changeset, :currency_symbol, Money.currency_symbol(currency))
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
