#!/bin/bash

# Check if merge to master
if [ "${TRAVIS_BRANCH}" = master ] & [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  # Install AWS CLI
  pip install --user awscli

  # Build container
  docker build -t $AWS_ECS_CONTAINER_NAME \
    --build-arg HOST=$HOST \
    --build-arg ERLANG_COOKIE=$ERLANG_COOKIE \
    --build-arg APPSIGNAL_NAME=$APPSIGNAL_NAME \
    --build-arg APPSIGNAL_KEY=$APPSIGNAL_KEY \
    --build-arg SENDGRID_API_KEY=$SENDGRID_API_KEY \
    --build-arg SUBS_ADMIN_EMAIL=$SUBS_ADMIN_EMAIL \
    --build-arg PHOENIX_SECRET_KEY_BASE=$PHOENIX_SECRET_KEY_BASE \
    --build-arg SESSION_COOKIE_NAME=$SESSION_COOKIE_NAME \
    --build-arg SESSION_COOKIE_SIGNING_SALT=$SESSION_COOKIE_SIGNING_SALT \
    --build-arg SESSION_COOKIE_ENCRYPTION_SALT=$SESSION_COOKIE_ENCRYPTION_SALT \
    --build-arg GUARDIAN_SECRET_KEY=$GUARDIAN_SECRET_KEY \
    .

  # Tag docker image
  docker tag $AWS_ECS_DOCKER_IMAGE "$AWS_ECS_URL"/"$AWS_ECS_DOCKER_IMAGE"

  # Login to aws ecr
  eval "$(aws ecr get-login --no-include-email --region $AWS_ECS_REGION)"

  # Upload docker image to repo
  docker push "$AWS_ECS_URL"/"$AWS_ECS_DOCKER_IMAGE"

  # Configure ECS cluster and AWS_ECS_region so we don't have to send it on every command
  ecs-cli configure --cluster=$AWS_ECS_CLUSTER_NAME --region=$AWS_ECS_REGION

  sed -i '.original' \
    -e 's/$AWS_ECS_URL/'$AWS_ECS_URL'/g' \
    -e 's/$AWS_ECS_DOCKER_IMAGE/'$AWS_ECS_DOCKER_IMAGE'/g' \
    -e 's/$AWS_ECS_CONTAINER_NAME/'$AWS_ECS_CONTAINER_NAME'/g' \
    -e 's/$DATABASE_URL/'$DATABASE_URL'/g' \
    -e 's/$HOST/'$HOST'/g' \
    -e 's/$PORT/'$PORT'/g' \
    config/ci/docker-compose-prod.yml

  # Stops all tasks and deletes service
  ecs-cli compose \
    --file config/ci/docker-compose-prod.yml \
    --project-name "$AWS_ECS_PROJECT_NAME" \
    service rm

  # Even with `wait` I'm getting InvalidParameterException: Unable to Start a service that is still Draining
  sleep 5

  # Start a new service with latest image
  ecs-cli compose \
    --file config/ci/docker-compose-prod.yml \
    --project-name "$AWS_ECS_PROJECT_NAME" service up
fi
