# Alias this container as builder:
FROM bitwalker/alpine-elixir-phoenix as builder

WORKDIR /subs

ARG HOST
ARG ERLANG_COOKIE
ARG APPSIGNAL_NAME
ARG APPSIGNAL_KEY
ARG SENDGRID_API_KEY
ARG SUBS_ADMIN_EMAIL
ARG PHOENIX_SECRET_KEY_BASE
ARG SESSION_COOKIE_NAME
ARG SESSION_COOKIE_SIGNING_SALT
ARG SESSION_COOKIE_ENCRYPTION_SALT
ARG GUARDIAN_SECRET_KEY

ENV MIX_ENV=prod \
    SUBS_WEB_KEYKEY=/etc/letsencrypt/live/$HOST/privkey.pem \
    SUBS_WEB_CERTFILE=/etc/letsencrypt/live/$HOST/cert.pem \
    SUBS_WEB_CACERTFILE=/etc/letsencrypt/live/$HOST/chain.pem \
    HOST=$HOST \
    ERLANG_COOKIE=$ERLANG_COOKIE \
    APPSIGNAL_BUILD_FOR_MUSL=1\
    APPSIGNAL_NAME=$APPSIGNAL_NAME \
    APPSIGNAL_KEY=$APPSIGNAL_KEY \
    SENDGRID_API_KEY=$SENDGRID_API_KEY \
    SUBS_ADMIN_EMAIL=$SUBS_ADMIN_EMAIL \
    PHOENIX_SECRET_KEY_BASE=$PHOENIX_SECRET_KEY_BASE \
    SESSION_COOKIE_NAME=$SESSION_COOKIE_NAME \
    SESSION_COOKIE_SIGNING_SALT=$SESSION_COOKIE_SIGNING_SALT \
    SESSION_COOKIE_ENCRYPTION_SALT=$SESSION_COOKIE_ENCRYPTION_SALT \
    GUARDIAN_SECRET_KEY=$GUARDIAN_SECRET_KEY

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

RUN mix release --env=prod --verbose
RUN cp services.json ./rel/releases/subs_web/services.json

### Release

FROM alpine:3.6

ARG HOST

# We need bash and openssl for Phoenix
# The update is needed for appsignal
RUN apk upgrade --no-cache && \
    apk add --no-cache bash openssl && \
    apk add --update alpine-sdk coreutils curl

ENV MIX_ENV=prod \
    REPLACE_OS_VARS=true \
    SHELL=/bin/bash

# Dir where phoenix is looking for cert files. Default for letsencrypt
WORKDIR /etc/letsencrypt/live/$HOST

COPY --from=builder /subs/tmp/privkey.pem .
COPY --from=builder /subs/tmp/chain.pem .
COPY --from=builder /subs/tmp/cert.pem .

WORKDIR /subs

COPY --from=builder /subs/rel/releases .

CMD ["subs_web/bin/subs", "foreground"]
