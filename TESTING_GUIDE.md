# Testing Guide

## Quick Start

### Option 1: Run with Docker (Recommended)

```bash
# 1. Create .env file (optional - defaults are provided)
cp .env.example .env

# 2. Start all containers
docker-compose up --build

# 3. Wait for services to be ready (check logs)
# You should see: "Nest application successfully started"

# 4. Test the API
curl http://localhost:3000/users
```

### Option 2: Run Locally (Without Docker)

```bash
# 1. Install Node.js 24.x
# 2. Install PostgreSQL locally
# 3. Create database
createdb library

# 4. Install dependencies
npm install

# 5. Create .env file
cp .env.example .env
# Update DB_HOST to 'localhost' in .env

# 6. Run migrations
npm run migration:run

# 7. Start the application
npm run start:dev
```

## Testing the API

### Using cURL

#### Users Endpoints

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"login": "john_doe", "password": "password123"}'

# Get all users
curl http://localhost:3000/users

# Get user by ID (replace {id} with actual UUID)
curl http://localhost:3000/users/{id}

# Update user
curl -X PATCH http://localhost:3000/users/{id} \
  -H "Content-Type: application/json" \
  -d '{"password": "newpassword123"}'

# Delete user
curl -X DELETE http://localhost:3000/users/{id}
```

#### Artists Endpoints

```bash
# Create an artist
curl -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"name": "The Beatles", "grammy": true}'

# Get all artists
curl http://localhost:3000/artists

# Get artist by ID
curl http://localhost:3000/artists/{id}

# Update artist
curl -X PATCH http://localhost:3000/artists/{id} \
  -H "Content-Type: application/json" \
  -d '{"grammy": false}'

# Delete artist
curl -X DELETE http://localhost:3000/artists/{id}
```

#### Albums Endpoints

```bash
# Create an album (replace {artistId} with actual UUID)
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{"name": "Abbey Road", "year": 1969, "artistId": "{artistId}"}'

# Get all albums
curl http://localhost:3000/albums

# Get album by ID
curl http://localhost:3000/albums/{id}

# Update album
curl -X PATCH http://localhost:3000/albums/{id} \
  -H "Content-Type: application/json" \
  -d '{"year": 1970}'

# Delete album
curl -X DELETE http://localhost:3000/albums/{id}
```

#### Tracks Endpoints

```bash
# Create a track
curl -X POST http://localhost:3000/tracks \
  -H "Content-Type: application/json" \
  -d '{"name": "Come Together", "duration": 259, "artistId": "{artistId}", "albumId": "{albumId}"}'

# Get all tracks
curl http://localhost:3000/tracks

# Get track by ID
curl http://localhost:3000/tracks/{id}

# Update track
curl -X PATCH http://localhost:3000/tracks/{id} \
  -H "Content-Type: application/json" \
  -d '{"duration": 260}'

# Delete track
curl -X DELETE http://localhost:3000/tracks/{id}
```

#### Favorites Endpoints

```bash
# Create a favorite
curl -X POST http://localhost:3000/favorites \
  -H "Content-Type: application/json" \
  -d '{"userId": "{userId}", "trackId": "{trackId}"}'

# Get all favorites
curl http://localhost:3000/favorites

# Get favorite by ID
curl http://localhost:3000/favorites/{id}

# Delete favorite
curl -X DELETE http://localhost:3000/favorites/{id}
```

### Using Postman or Insomnia

1. Import the collection (see `api-tests.postman.json` below)
2. Set base URL to `http://localhost:3000`
3. Run requests in sequence

### Using Browser

Simply navigate to:
- `http://localhost:3000/users` - Get all users
- `http://localhost:3000/artists` - Get all artists
- etc.

## Running Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Checking Application Health

### Check if containers are running

```bash
docker-compose ps
```

### View application logs

```bash
# All services
docker-compose logs

# Application only
docker-compose logs app

# Database only
docker-compose logs postgres

# Follow logs
docker-compose logs -f app
```

### Check database connection

```bash
# Connect to PostgreSQL container
docker-compose exec postgres psql -U postgres -d library

# List tables
\dt

# Check users table
SELECT * FROM users;

# Exit
\q
```

## Common Issues and Solutions

### Issue: Port 3000 already in use

**Solution:**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Issue: Database connection failed

**Solution:**
1. Check if postgres container is healthy:
   ```bash
   docker-compose ps
   ```
2. Wait for health check to pass (may take 10-30 seconds)
3. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

### Issue: Migrations not running

**Solution:**
```bash
# Run migrations manually
docker-compose exec app npm run migration:run
```

### Issue: Application not restarting on file changes

**Solution:**
- Ensure volume mount is working: `./src:/app/src` in docker-compose.yml
- Check NODE_ENV is set to 'development'
- Restart containers: `docker-compose restart app`

## Performance Testing

### Check Docker image size

```bash
docker images | grep library
```

### Check container resource usage

```bash
docker stats
```

## Security Testing

### Scan for vulnerabilities

```bash
# Scan npm dependencies
npm run scan

# Scan Docker images
docker scan library-app:latest
docker scan library-postgres:latest
```

## Complete Test Workflow

```bash
# 1. Start services
docker-compose up -d --build

# 2. Wait for services (30 seconds)
sleep 30

# 3. Check health
docker-compose ps

# 4. Test API
curl http://localhost:3000/users

# 5. Create test data
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"login": "testuser", "password": "testpass"}'

# 6. Verify data
curl http://localhost:3000/users

# 7. Check database
docker-compose exec postgres psql -U postgres -d library -c "SELECT * FROM users;"

# 8. Stop services
docker-compose down
```

