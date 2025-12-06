# Library REST Service

A REST service built with Nest.js, PostgreSQL, and Docker.

## Prerequisites

- Docker and Docker Compose installed
- Docker Hub account (for pushing images)

## Tech Stack

- Node.js 24.10.0
- Nest.js
- TypeORM
- PostgreSQL
- Docker

## Getting Started

### 1. Build and Run with Docker Compose

```bash
# Build and start all containers
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

The application will be available at `http://localhost:3000`

**Note:** In development mode (default), the application automatically restarts when you make changes to files in the `src` folder thanks to volume mounting and hot reload.

### 2. Build Docker Images

```bash
# Build application image
docker build -t your-dockerhub-username/library-app:latest .

# Build PostgreSQL image
docker build -f Dockerfile.postgres -t your-dockerhub-username/library-postgres:latest .
```

### 3. Scan for Security Vulnerabilities

```bash
# Scan npm dependencies (free solution)
npm run scan

# Scan Docker images
docker scan your-dockerhub-username/library-app:latest
docker scan your-dockerhub-username/library-postgres:latest
```

### 4. Push Images to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push application image
docker push your-dockerhub-username/library-app:latest

# Push PostgreSQL image
docker push your-dockerhub-username/library-postgres:latest
```

## API Endpoints

- `GET /users` - Get all users
- `POST /users` - Create a user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

- `GET /artists` - Get all artists
- `POST /artists` - Create an artist
- `GET /artists/:id` - Get artist by ID
- `PATCH /artists/:id` - Update artist
- `DELETE /artists/:id` - Delete artist

- `GET /albums` - Get all albums
- `POST /albums` - Create an album
- `GET /albums/:id` - Get album by ID
- `PATCH /albums/:id` - Update album
- `DELETE /albums/:id` - Delete album

- `GET /tracks` - Get all tracks
- `POST /tracks` - Create a track
- `GET /tracks/:id` - Get track by ID
- `PATCH /tracks/:id` - Update track
- `DELETE /tracks/:id` - Delete track

- `GET /favorites` - Get all favorites
- `POST /favorites` - Create a favorite
- `GET /favorites/:id` - Get favorite by ID
- `DELETE /favorites/:id` - Delete favorite

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

- `DB_HOST` - Database host (default: postgres)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_NAME` - Database name (default: library)
- `NODE_ENV` - Environment (development/production)

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod
```

## Docker Network

The application uses a custom Docker network (`library-network`) for communication between the application and database containers.

## Database Migrations

The application uses TypeORM migrations to manage database schema. Migrations are automatically run when the application starts.

```bash
# Generate a new migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations manually
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

### Quick Test

```bash
# Start the application
docker-compose up -d --build

# Wait for services to start (30 seconds)
sleep 30

# Test API (Linux/Mac)
chmod +x test-api.sh
./test-api.sh

# Test API (Windows PowerShell)
.\test-api.ps1

# Or test manually with curl
curl http://localhost:3000/users
```

## Features

- ✅ Multi-stage Docker build for optimized image size (< 500MB)
- ✅ Hot reload in development mode (restarts on src folder changes)
- ✅ Custom Docker network for container communication
- ✅ Automatic container restart on crash
- ✅ Database volumes for data persistence
- ✅ TypeORM migrations for database schema management
- ✅ Vulnerability scanning with npm audit

