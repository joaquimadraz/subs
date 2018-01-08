defmodule Notifier.Email do
  import Bamboo.Email

  @from_email Application.get_env(:notifier, :from_email)

  def confirmation_email(to_email, %{confirmation_url: confirmation_url}) do
    subject = "Confirm your Subs account"
    body = """
    Welcome to Subs,

    Please click on this link to confirm your account:
    #{confirmation_url}

    Thanks!
    """

    new_email()
    |> to(to_email)
    |> from(@from_email)
    |> subject(subject)
    |> text_body(body)
  end

  def recover_password_email(to_email, %{recover_url: recover_url}) do
    subject = "Reset your Subs password"
    body = """
    Subs received a request to reset your password.

    To reset your password, click on the link below:
    #{recover_url}

    Thanks!
    """

    new_email()
    |> to(to_email)
    |> from(@from_email)
    |> subject(subject)
    |> text_body(body)
  end

  def notification_email(notification) do
    new_email()
    |> to(notification.to)
    |> from(@from_email)
    |> subject(notification.title)
    |> text_body(notification.body)
  end
end
