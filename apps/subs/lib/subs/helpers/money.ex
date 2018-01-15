defmodule Subs.Helpers.Money do
  @moduledoc false
  def currency_codes, do: ~w(EUR GBP USD)

  def default_currency, do: "GBP"

  def default_currency_symbol, do: currency_symbol(default_currency())

  def currency_symbol("EUR"), do: "€"
  def currency_symbol("GBP"), do: "£"
  def currency_symbol("USD"), do: "$"
  def currency_symbol(_), do: nil

  def consolidate(value), do: round(value * 100.0)

  def to_human(value), do: Float.to_string(value / 100.0, decimals: 2)

  def to_human_formated(value, currency_symbol) do
    "#{currency_symbol}#{to_human(value)}"
  end
end
