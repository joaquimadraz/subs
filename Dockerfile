# Alias this container as builder:
FROM bitwalker/alpine-elixir-phoenix as builder

WORKDIR /subs

ARG host
ARG erlang_cookie

ENV MIX_ENV=prod \
    HOST=$host \
    SUBS_WEB_KEYKEY=/etc/letsencrypt/live/$host/privkey.pem \
    SUBS_WEB_CERTFILE=/etc/letsencrypt/live/$host/cert.pem \
    SUBS_WEB_CACERTFILE=/etc/letsencrypt/live/$host/chain.pem \
    SUBS_ADMIN_EMAIL=no_reply@$host \
    ERLANG_COOKIE=$erlang_cookie

# tmp where ssl files are
COPY tmp tmp

# Umbrella
COPY mix.exs mix.lock ./
COPY config config
COPY services.json services.json

# Apps
COPY apps apps
RUN mix do deps.get, deps.compile
RUN cd deps/comeonin && make clean && make

# Build assets in production mode:
WORKDIR /subs/apps/subs_web/frontend
RUN npm install --global yarn && yarn install && yarn build

WORKDIR /subs/apps/subs_web
RUN mix phx.digest

WORKDIR /subs
COPY rel rel
RUN cp services.json ./rel/releases/subs_web/services.json

RUN mix release --env=prod --verbose

### Release

FROM alpine:3.6

ARG host

RUN apk upgrade --no-cache && \
    apk add --no-cache bash openssl
    # we need bash and openssl for Phoenix

ENV MIX_ENV=prod \
    REPLACE_OS_VARS=true \
    SHELL=/bin/bash

# Dir where phoenix is looking for cert files. Default for letsencrypt
WORKDIR /etc/letsencrypt/live/$host

COPY --from=builder /subs/tmp/privkey.pem .
COPY --from=builder /subs/tmp/chain.pem .
COPY --from=builder /subs/tmp/cert.pem .

WORKDIR /subs

COPY --from=builder /subs/rel/releases .

CMD ["subs_web/bin/subs", "foreground"]
