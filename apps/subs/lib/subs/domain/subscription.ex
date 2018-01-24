defmodule Subs.Subscription do
  @moduledoc false

  use Subs.Schema
  alias Subs.User
  alias Subs.Helpers.Money

  @subs_services Application.get_env(:subs, :subs_services)
  @dt Application.get_env(:subs, :dt)

  schema "subscriptions" do
    field :name, :string
    field :description, :string
    field :amount, :integer
    field :amount_currency
    field :amount_currency_symbol
    field :cycle, :string
    field :color, :string
    field :first_bill_date, :naive_datetime
    field :next_bill_date, :naive_datetime
    field :current_bill_date, :naive_datetime, virtual: true
    field :archived, :boolean
    field :archived_at, :naive_datetime
    field :service_code, :string
    field :type, :string
    field :type_description, :string

    belongs_to :user, User

    timestamps()
  end

  @required_create_fields ~w(
    name
    amount
    amount_currency
    cycle
    user_id
  )a

  @optional_fields ~w(
    color
    description
    first_bill_date
    type
    type_description
  )a

  @required_updated_fields ~w(
    name
    amount
    amount_currency
    cycle
  )a

  @updatable_fields ~w(
    name
    description
    amount
    amount_currency
    cycle
    color
    first_bill_date
    next_bill_date
    archived
    type
    type_description
  )

  @currency_codes Money.currency_codes()
  @cycles ~w(monthly yearly)
  @types ~w(card direct_debit other)
  @default_color "#E2E2E2"

  def build_with_user(user, params) do
    user
    |> build_assoc(:subscriptions)
    |> create_changeset(params)
  end

  def create_changeset(struct, params = %{"service_code" => service_code}) do
    params = consolidate_amount(params)

    struct
    |> cast(params, @required_create_fields ++ @optional_fields ++ ~w(service_code))
    |> validate_required(~w(amount amount_currency cycle user_id)a)
    |> foreign_key_constraint(:user_id)
    |> validate_service(service_code)
    |> validate_subscription()
  end
  def create_changeset(struct, params) do
    params = consolidate_amount(params)

    struct
    |> cast(params, @required_create_fields ++ @optional_fields)
    |> validate_required(@required_create_fields)
    |> foreign_key_constraint(:user_id)
    |> validate_subscription()
    |> sanitize_color(:create)
  end

  def update_changeset(struct, params \\ %{}) do
    params = consolidate_amount(params)

    struct
    |> cast(params, @updatable_fields)
    |> validate_required(@required_updated_fields)
    |> validate_subscription()
    |> sanitize_color(:update)
    |> try_archive()
  end

  def monthly?(subscription), do: subscription.cycle == "monthly"
  def yearly?(subscription), do: subscription.cycle == "yearly"

  def cycle_step(subscription), do: if(subscription.cycle == "monthly", do: :months, else: :years)

  defp validate_subscription(changeset) do
    changeset
    |> validate_number(:amount, greater_than: 0)
    |> validate_inclusion(:amount_currency, @currency_codes, message: "unknown currency")
    |> validate_inclusion(:cycle, @cycles, message: "must be one of: monthly, yearly")
    |> validate_inclusion(:type, @types, message: "must be one of: card, direct debit, other")
    |> validate_type_other()
    |> validate_format(:color, ~r/^#(?:[0-9a-fA-F]{3}){1,2}$/, message: "invalid format, must be HEX format, ex: #FF0000")
    |> sanitize_amount_currency()
    |> populate_first_bill_date()
    |> populate_next_bill_date()
    |> populate_type_description()
  end

  defp validate_type_other(changeset) do
    case get_field(changeset, :type) do
      "other" ->
        validate_required(changeset, :type_description)
      _ ->
        changeset
    end
  end

  defp populate_type_description(changeset) do
    case get_change(changeset, :type_description) do
      nil ->
        case get_change(changeset, :type) do
          nil -> changeset
          "card" -> put_change(changeset, :type_description, "Card")
          "direct_debit" -> put_change(changeset, :type_description, "Direct Debit")
          _ -> changeset
        end
      _ -> changeset
    end
  end

  defp sanitize_color(changeset, :create) do
    case get_change(changeset, :color) do
      nil -> put_change(changeset, :color, @default_color)
      value -> put_change(changeset, :color, String.upcase(value))
    end
  end

  defp sanitize_color(changeset, :update) do
    case get_change(changeset, :color) do
      nil -> changeset
      value -> put_change(changeset, :color, String.upcase(value))
    end
  end

  defp sanitize_amount_currency(changeset) do
    case get_change(changeset, :amount_currency) do
      nil -> changeset
      value ->
        amount_currency = String.upcase(value)

        changeset
        |> put_change(:amount_currency, amount_currency)
        |> put_change(:amount_currency_symbol, Money.currency_symbol(amount_currency))
    end
  end

  defp populate_first_bill_date(changeset = %{valid?: false}), do: changeset
  defp populate_first_bill_date(changeset) do
    case get_field(changeset, :first_bill_date) do
      nil ->
        put_change(changeset, :first_bill_date, @dt.today_beginning_of_day())
      _ ->
        changeset
    end
  end

  defp populate_next_bill_date(changeset = %{valid?: false}), do: changeset
  defp populate_next_bill_date(changeset) do
    with {_, cycle} <- fetch_field(changeset, :cycle),
         {:ok, first_bill_date} <- fetch_change(changeset, :first_bill_date) do
      next_bill_date = calculate_next_bill_date(first_bill_date, cycle)
      put_change(changeset, :next_bill_date, next_bill_date)
    else
      :error -> changeset
    end
  end

  defp calculate_next_bill_date(first_bill_date, "monthly") do
    @dt.calculate_next_bill_date(first_bill_date, :months)
  end
  defp calculate_next_bill_date(first_bill_date, "yearly") do
    @dt.calculate_next_bill_date(first_bill_date, :years)
  end

  # Consolidates amount as integer value before storing on the database.
  # 1.99 (£) will be saved as 199
  # 7 (£) will be saved as 700
  defp consolidate_amount(params = %{"amount" => amount}) when is_binary(amount) do
    case Float.parse(amount) do
      :error -> params # skip consolidate, fails on changeset
      {parsed, _} -> do_consolidate_amount(%{params | "amount" => parsed})
    end
  end
  defp consolidate_amount(params = %{"amount" => _amount}) do
    do_consolidate_amount(params)
  end
  defp consolidate_amount(params), do: params

  defp do_consolidate_amount(params = %{"amount" => amount}) do
    %{params | "amount" => Money.consolidate(amount)}
  end

  defp try_archive(changeset = %{valid?: false}), do: changeset
  defp try_archive(changeset = %{changes: %{archived: true}}) do
    put_change(changeset, :archived_at, @dt.now())
  end
  defp try_archive(changeset), do: changeset

  defp validate_service(changeset, service_code) do
    case @subs_services.get_service(service_code) do
      nil ->
        add_error(changeset, :service_code, "unknown service")
      service_data ->
        changeset
        |> put_change(:name, service_data["name"])
        |> put_change(:color, service_data["color"])
    end
  end
end
