defmodule SubsWeb.RollbaxHelper do
  def report(conn, kind, reason, stacktrace) do
    conn =
      conn
      |> Plug.Conn.fetch_cookies()
      |> Plug.Conn.fetch_query_params()

    params =
      for {key, _value} = tuple <- conn.params, into: %{} do
        if key in ["password", "password_confirmation"] do
          {key, "[FILTERED]"}
        else
          tuple
        end
      end

    conn_data = %{
      "request" => %{
        "cookies" => conn.req_cookies,
        "url" => "#{conn.scheme}://#{conn.host}:#{conn.port}#{conn.request_path}",
        "user_ip" => List.to_string(:inet.ntoa(conn.remote_ip)),
        "headers" => Enum.into(conn.req_headers, %{}),
        "params" => conn.params,
        "method" => conn.method,
      }
    }

    Rollbax.report(kind, reason, stacktrace, %{}, conn_data)
  end
end
