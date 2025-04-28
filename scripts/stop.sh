# !/bin/bash

# Get the current version on package.json
version=$(jq -r '.version' package.json)
echo "Current version: $version"

# Stop if the container is running
if [ "$(docker ps -q -f name=streamfund-backend)" ]; then
    echo "Stopping the running container..."
    docker stop streamfund-backend
    echo "Removing the container..."
    docker rm streamfund-backend
    echo "Container removed."
    echo "Removing the volume..."
    docker volume rm tknmds-streamfund-backend
    echo "Container stopped."
fi