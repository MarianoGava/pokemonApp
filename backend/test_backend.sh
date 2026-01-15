#!/bin/bash

# Simple script to test the backend endpoints
# Make sure the server is running: rails server -p 3001

BASE_URL="http://localhost:3001/api/v1"
COOKIE_FILE="cookies.txt"

echo "🧪 Testing Pokemon API Backend"
echo "================================"
echo ""

# Test 1: Login
echo "1️⃣  Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  -c "$COOKIE_FILE")

echo "Response: $LOGIN_RESPONSE"
if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  exit 1
fi
echo ""

# Test 2: Get Pokemons List
echo "2️⃣  Testing Get Pokemons List..."
POKEMONS_RESPONSE=$(curl -s -X GET "$BASE_URL/pokemons?offset=0&limit=5" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE")

echo "Response (first 200 chars): ${POKEMONS_RESPONSE:0:200}..."
if echo "$POKEMONS_RESPONSE" | grep -q "results"; then
  echo "✅ Pokemons list retrieved"
else
  echo "❌ Failed to get pokemons list"
  exit 1
fi
echo ""

# Test 3: Get Pokemon Detail
echo "3️⃣  Testing Get Pokemon Detail (ID: 1)..."
POKEMON_RESPONSE=$(curl -s -X GET "$BASE_URL/pokemons/1" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE")

echo "Response (first 200 chars): ${POKEMON_RESPONSE:0:200}..."
if echo "$POKEMON_RESPONSE" | grep -q "name"; then
  echo "✅ Pokemon detail retrieved"
else
  echo "❌ Failed to get pokemon detail"
  exit 1
fi
echo ""

# Test 4: Unauthorized Access
echo "4️⃣  Testing Unauthorized Access..."
UNAUTH_RESPONSE=$(curl -s -X GET "$BASE_URL/pokemons" \
  -H "Content-Type: application/json")

if echo "$UNAUTH_RESPONSE" | grep -q "Unauthorized"; then
  echo "✅ Unauthorized access correctly rejected"
else
  echo "❌ Security issue: unauthorized access allowed"
  exit 1
fi
echo ""

# Test 5: Logout
echo "5️⃣  Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE")

echo "Response: $LOGOUT_RESPONSE"
if echo "$LOGOUT_RESPONSE" | grep -q "success.*true"; then
  echo "✅ Logout successful"
else
  echo "❌ Logout failed"
  exit 1
fi
echo ""

# Cleanup
rm -f "$COOKIE_FILE"

echo "================================"
echo "🎉 All tests passed!"
