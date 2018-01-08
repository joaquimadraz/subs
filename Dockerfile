# Alias this container as builder:
FROM bitwalker/alpine-elixir-phoenix as builder

WORKDIR /subs

ENV MIX_ENV=prod

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
RUN npm install && npm rebuild node-sass

WORKDIR /subs/apps/subs_web
RUN MIX_ENV=prod mix phx.digest

WORKDIR /subs
COPY rel rel
RUN cp services.json ./rel/releases/subs_web/services.json

RUN mix release --env=prod --verbose

### Release

FROM alpine:3.6

RUN apk upgrade --no-cache && \
    apk add --no-cache bash openssl
    # we need bash and openssl for Phoenix

EXPOSE 4000

ENV MIX_ENV=prod \
    REPLACE_OS_VARS=true \
    SHELL=/bin/bash

WORKDIR /subs

COPY --from=builder /subs/rel/releases .

CMD ["subs_web/bin/subs", "foreground"]
