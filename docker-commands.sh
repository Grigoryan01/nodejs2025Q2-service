#!/bin/bash

# Docker Commands Helper Script
# This script provides common Docker operations for the Library REST Service

set -e

DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME:-"your-dockerhub-username"}
APP_IMAGE="${DOCKERHUB_USERNAME}/library-app:latest"
POSTGRES_IMAGE="${DOCKERHUB_USERNAME}/library-postgres:latest"

case "$1" in
  build)
    echo "Building Docker images..."
    docker build -t ${APP_IMAGE} .
    docker build -f Dockerfile.postgres -t ${POSTGRES_IMAGE} .
    echo "Images built successfully!"
    ;;
  
  scan)
    echo "Scanning images for security vulnerabilities..."
    docker scan ${APP_IMAGE}
    docker scan ${POSTGRES_IMAGE}
    ;;
  
  push)
    echo "Pushing images to Docker Hub..."
    docker push ${APP_IMAGE}
    docker push ${POSTGRES_IMAGE}
    echo "Images pushed successfully!"
    ;;
  
  build-and-push)
    echo "Building, scanning, and pushing images..."
    $0 build
    $0 scan
    $0 push
    ;;
  
  up)
    echo "Starting containers with docker-compose..."
    docker-compose up --build
    ;;
  
  down)
    echo "Stopping containers..."
    docker-compose down
    ;;
  
  *)
    echo "Usage: $0 {build|scan|push|build-and-push|up|down}"
    echo ""
    echo "Commands:"
    echo "  build           - Build Docker images"
    echo "  scan            - Scan images for security vulnerabilities"
    echo "  push            - Push images to Docker Hub"
    echo "  build-and-push  - Build, scan, and push images"
    echo "  up              - Start containers with docker-compose"
    echo "  down            - Stop containers"
    echo ""
    echo "Set DOCKERHUB_USERNAME environment variable to customize image names"
    exit 1
    ;;
esac

