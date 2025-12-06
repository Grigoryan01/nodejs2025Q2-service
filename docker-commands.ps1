# Docker Commands Helper Script for PowerShell
# This script provides common Docker operations for the Library REST Service

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("build", "scan", "push", "build-and-push", "up", "down")]
    [string]$Command,
    
    [string]$DockerHubUsername = "your-dockerhub-username"
)

$ErrorActionPreference = "Stop"

$AppImage = "${DockerHubUsername}/library-app:latest"
$PostgresImage = "${DockerHubUsername}/library-postgres:latest"

switch ($Command) {
    "build" {
        Write-Host "Building Docker images..." -ForegroundColor Green
        docker build -t $AppImage .
        docker build -f Dockerfile.postgres -t $PostgresImage .
        Write-Host "Images built successfully!" -ForegroundColor Green
    }
    
    "scan" {
        Write-Host "Scanning images for security vulnerabilities..." -ForegroundColor Yellow
        docker scan $AppImage
        docker scan $PostgresImage
    }
    
    "push" {
        Write-Host "Pushing images to Docker Hub..." -ForegroundColor Cyan
        docker push $AppImage
        docker push $PostgresImage
        Write-Host "Images pushed successfully!" -ForegroundColor Green
    }
    
    "build-and-push" {
        Write-Host "Building, scanning, and pushing images..." -ForegroundColor Magenta
        & $PSCommandPath -Command build -DockerHubUsername $DockerHubUsername
        & $PSCommandPath -Command scan -DockerHubUsername $DockerHubUsername
        & $PSCommandPath -Command push -DockerHubUsername $DockerHubUsername
    }
    
    "up" {
        Write-Host "Starting containers with docker-compose..." -ForegroundColor Green
        docker-compose up --build
    }
    
    "down" {
        Write-Host "Stopping containers..." -ForegroundColor Yellow
        docker-compose down
    }
}

