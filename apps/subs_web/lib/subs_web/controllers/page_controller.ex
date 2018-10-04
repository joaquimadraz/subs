defmodule SubsWeb.PageController do
  use SubsWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
