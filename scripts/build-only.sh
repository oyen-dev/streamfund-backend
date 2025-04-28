# !/bin/bash

# Get the current version on package.json
version=$(jq -r '.version' package.json)
echo "Current version: $version"

# Build the image for the app with the version tag
echo "Building the image..."
docker build -t "streamfund/backend:$version" --platform linux/amd64 --no-cache .

echo "Build completed successfully!"