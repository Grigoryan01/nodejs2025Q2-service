# API Testing Script for PowerShell
# This script tests all endpoints of the Library REST Service

$BaseUrl = "http://localhost:3000"
$Results = @()

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Description
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Body) {
            $response = Invoke-RestMethod -Uri "$BaseUrl$Endpoint" -Method $Method -Headers $headers -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri "$BaseUrl$Endpoint" -Method $Method -Headers $headers
        }
        
        Write-Host "✓ $Description" -ForegroundColor Green
        return @{ Success = $true; Response = $response }
    } catch {
        Write-Host "✗ $Description - Failed: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Response = $null }
    }
}

Write-Host "=== Testing Library REST Service ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Get all users
$result = Test-Endpoint -Method "GET" -Endpoint "/users" -Description "GET /users"
$Results += $result

# Test 2: Create a user
$userBody = '{"login": "testuser", "password": "testpass123"}' | ConvertFrom-Json | ConvertTo-Json
$result = Test-Endpoint -Method "POST" -Endpoint "/users" -Body $userBody -Description "POST /users"
if ($result.Success) {
    $userId = $result.Response.id
    Write-Host "  Created user with ID: $userId" -ForegroundColor Gray
    $Results += $result
}

# Test 3: Get user by ID
if ($userId) {
    $result = Test-Endpoint -Method "GET" -Endpoint "/users/$userId" -Description "GET /users/:id"
    $Results += $result
}

# Test 4: Create an artist
$artistBody = '{"name": "Test Artist", "grammy": true}' | ConvertFrom-Json | ConvertTo-Json
$result = Test-Endpoint -Method "POST" -Endpoint "/artists" -Body $artistBody -Description "POST /artists"
if ($result.Success) {
    $artistId = $result.Response.id
    Write-Host "  Created artist with ID: $artistId" -ForegroundColor Gray
    $Results += $result
}

# Test 5: Create an album
if ($artistId) {
    $albumBody = @{
        name = "Test Album"
        year = 2024
        artistId = $artistId
    } | ConvertTo-Json
    $result = Test-Endpoint -Method "POST" -Endpoint "/albums" -Body $albumBody -Description "POST /albums"
    if ($result.Success) {
        $albumId = $result.Response.id
        Write-Host "  Created album with ID: $albumId" -ForegroundColor Gray
        $Results += $result
    }
}

# Test 6: Create a track
if ($artistId -and $albumId) {
    $trackBody = @{
        name = "Test Track"
        duration = 180
        artistId = $artistId
        albumId = $albumId
    } | ConvertTo-Json
    $result = Test-Endpoint -Method "POST" -Endpoint "/tracks" -Body $trackBody -Description "POST /tracks"
    if ($result.Success) {
        $trackId = $result.Response.id
        Write-Host "  Created track with ID: $trackId" -ForegroundColor Gray
        $Results += $result
    }
}

# Test 7: Create a favorite
if ($userId -and $trackId) {
    $favoriteBody = @{
        userId = $userId
        trackId = $trackId
    } | ConvertTo-Json
    $result = Test-Endpoint -Method "POST" -Endpoint "/favorites" -Body $favoriteBody -Description "POST /favorites"
    if ($result.Success) {
        $favoriteId = $result.Response.id
        Write-Host "  Created favorite with ID: $favoriteId" -ForegroundColor Gray
        $Results += $result
    }
}

# Test 8: Get all endpoints
Write-Host ""
Write-Host "Testing GET all endpoints..." -ForegroundColor Yellow
$endpoints = @("users", "artists", "albums", "tracks", "favorites")
foreach ($endpoint in $endpoints) {
    $result = Test-Endpoint -Method "GET" -Endpoint "/$endpoint" -Description "GET /$endpoint"
    $Results += $result
}

# Test 9: Update user
if ($userId) {
    $updateBody = '{"password": "newpassword123"}' | ConvertFrom-Json | ConvertTo-Json
    $result = Test-Endpoint -Method "PATCH" -Endpoint "/users/$userId" -Body $updateBody -Description "PATCH /users/:id"
    $Results += $result
}

# Test 10: Delete favorite
if ($favoriteId) {
    try {
        Invoke-RestMethod -Uri "$BaseUrl/favorites/$favoriteId" -Method "DELETE" | Out-Null
        Write-Host "✓ DELETE /favorites/:id" -ForegroundColor Green
        $Results += @{ Success = $true }
    } catch {
        Write-Host "✗ DELETE /favorites/:id - Failed" -ForegroundColor Red
        $Results += @{ Success = $false }
    }
}

# Summary
Write-Host ""
Write-Host "=== Testing Complete ===" -ForegroundColor Cyan
$successCount = ($Results | Where-Object { $_.Success -eq $true }).Count
$totalCount = $Results.Count
Write-Host "Results: $successCount/$totalCount tests passed" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

