#!/bin/bash

# API Testing Script
# This script tests all endpoints of the Library REST Service

BASE_URL="http://localhost:3000"

echo "=== Testing Library REST Service ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Test 1: Health check - Get all users (should return empty array initially)
echo "1. Testing GET /users..."
response=$(curl -s -w "\n%{http_code}" http://localhost:3000/users)
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 200 ]; then
    print_result 0 "GET /users - OK"
else
    print_result 1 "GET /users - Failed (HTTP $http_code)"
fi

# Test 2: Create a user
echo ""
echo "2. Testing POST /users..."
user_response=$(curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"login": "testuser", "password": "testpass123"}')
user_id=$(echo "$user_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$user_id" ]; then
    print_result 0 "POST /users - Created user with ID: $user_id"
    USER_ID=$user_id
else
    print_result 1 "POST /users - Failed"
    exit 1
fi

# Test 3: Get user by ID
echo ""
echo "3. Testing GET /users/:id..."
get_user_response=$(curl -s -w "\n%{http_code}" http://localhost:3000/users/$USER_ID)
get_user_code=$(echo "$get_user_response" | tail -n1)
if [ "$get_user_code" -eq 200 ]; then
    print_result 0 "GET /users/:id - OK"
else
    print_result 1 "GET /users/:id - Failed (HTTP $get_user_code)"
fi

# Test 4: Create an artist
echo ""
echo "4. Testing POST /artists..."
artist_response=$(curl -s -X POST http://localhost:3000/artists \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Artist", "grammy": true}')
artist_id=$(echo "$artist_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$artist_id" ]; then
    print_result 0 "POST /artists - Created artist with ID: $artist_id"
    ARTIST_ID=$artist_id
else
    print_result 1 "POST /artists - Failed"
fi

# Test 5: Create an album
echo ""
echo "5. Testing POST /albums..."
album_response=$(curl -s -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test Album\", \"year\": 2024, \"artistId\": \"$ARTIST_ID\"}")
album_id=$(echo "$album_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$album_id" ]; then
    print_result 0 "POST /albums - Created album with ID: $album_id"
    ALBUM_ID=$album_id
else
    print_result 1 "POST /albums - Failed"
fi

# Test 6: Create a track
echo ""
echo "6. Testing POST /tracks..."
track_response=$(curl -s -X POST http://localhost:3000/tracks \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test Track\", \"duration\": 180, \"artistId\": \"$ARTIST_ID\", \"albumId\": \"$ALBUM_ID\"}")
track_id=$(echo "$track_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$track_id" ]; then
    print_result 0 "POST /tracks - Created track with ID: $track_id"
    TRACK_ID=$track_id
else
    print_result 1 "POST /tracks - Failed"
fi

# Test 7: Create a favorite
echo ""
echo "7. Testing POST /favorites..."
favorite_response=$(curl -s -X POST http://localhost:3000/favorites \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\", \"trackId\": \"$TRACK_ID\"}")
favorite_id=$(echo "$favorite_response" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$favorite_id" ]; then
    print_result 0 "POST /favorites - Created favorite with ID: $favorite_id"
    FAVORITE_ID=$favorite_id
else
    print_result 1 "POST /favorites - Failed"
fi

# Test 8: Get all endpoints
echo ""
echo "8. Testing GET all endpoints..."
for endpoint in users artists albums tracks favorites; do
    response=$(curl -s -w "\n%{http_code}" http://localhost:3000/$endpoint)
    http_code=$(echo "$response" | tail -n1)
    if [ "$http_code" -eq 200 ]; then
        print_result 0 "GET /$endpoint - OK"
    else
        print_result 1 "GET /$endpoint - Failed (HTTP $http_code)"
    fi
done

# Test 9: Update operations
echo ""
echo "9. Testing PATCH operations..."
if [ ! -z "$USER_ID" ]; then
    update_response=$(curl -s -w "\n%{http_code}" -X PATCH http://localhost:3000/users/$USER_ID \
      -H "Content-Type: application/json" \
      -d '{"password": "newpassword123"}')
    update_code=$(echo "$update_response" | tail -n1)
    if [ "$update_code" -eq 200 ]; then
        print_result 0 "PATCH /users/:id - OK"
    else
        print_result 1 "PATCH /users/:id - Failed (HTTP $update_code)"
    fi
fi

# Test 10: Delete operations
echo ""
echo "10. Testing DELETE operations..."
if [ ! -z "$FAVORITE_ID" ]; then
    delete_response=$(curl -s -w "\n%{http_code}" -X DELETE http://localhost:3000/favorites/$FAVORITE_ID)
    delete_code=$(echo "$delete_response" | tail -n1)
    if [ "$delete_code" -eq 204 ]; then
        print_result 0 "DELETE /favorites/:id - OK"
    else
        print_result 1 "DELETE /favorites/:id - Failed (HTTP $delete_code)"
    fi
fi

echo ""
echo "=== Testing Complete ==="

