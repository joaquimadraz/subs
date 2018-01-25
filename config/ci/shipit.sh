#!/bin/bash

# Install AWS CLI
pip install --user awscli

# Install AWS ECS CLI
sudo curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli

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
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  --build-arg AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
  --build-arg OPENSUBS_S3_SECRETS_BUCKET=$OPENSUBS_S3_SECRETS_BUCKET \
  --build-arg DATABASE_URL=$DATABASE_URL \
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
  -e 's/$HOST/'$HOST'/g' \
  -e 's/$PORT/'$PORT'/g' \
  config/ci/docker-compose-prod.yml

# Deregister old task definition
REVISION=$(aws ecs list-task-definitions --region $AWS_ECS_REGION | jq '.taskDefinitionArns[]' | tr -d '"' | tail -1 | rev | cut -d':' -f 1 | rev)
if [ ! -z "$REVISION" ]; then
  aws ecs deregister-task-definition \
    --region $AWS_ECS_REGION \
    --task-definition $AWS_ECS_PROJECT_NAME:$REVISION \
    >> /tmp/task_output_app.txt
fi

# Stops all tasks
ecs-cli compose \
  --file config/ci/docker-compose-prod.yml \
  --project-name "$AWS_ECS_PROJECT_NAME" \
  service stop

# Start a new task
ecs-cli compose \
  --file config/ci/docker-compose-prod.yml \
  --project-name "$AWS_ECS_PROJECT_NAME" \
  service up
