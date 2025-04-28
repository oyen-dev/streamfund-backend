# !/bin/bash

# Get the current version on package.json
version=$(jq -r '.version' package.json)
echo "Current version: $version"

# Build the image for the app with the version tag
echo "Building the image..."
docker build -t "streamfund/backend:$version" --platform linux/amd64 --no-cache .

# Create a new tag for the latest version
echo "Tagging the image as latest..."
docker tag "streamfund/backend:$version" "streamfund/backend:latest"

# Push the image to Docker Hub
echo "Pushing the image to Docker Hub..."
docker push "streamfund/backend:$version"
docker push "streamfund/backend:latest"

# Remove the local image
echo "Removing the local image..."
docker rmi "streamfund/backend:$version"
docker rmi "streamfund/backend:latest"

# Remove dangling images
echo "Removing dangling images..."
docker rmi $(docker images -f "dangling=true" -q)
echo "Build and push completed successfully!"