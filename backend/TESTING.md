# Testing Guide - Pokemon API Backend

## 🚀 Quick Start Testing

### 1. Start the Server

```bash
cd backend
bundle install
rails server -p 3001
```

### 2. Test Endpoints Manually

#### Test Login (Required first)
```bash
# Login with admin/admin
curl -X POST http://localhost:3001/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  -c cookies.txt

# Should return: {"success":true,"message":"Login successful","user":{"username":"admin"}}
```

#### Test Get Pokemons List
```bash
# Get paginated pokemons list
curl -X GET "http://localhost:3001/api/v1/pokemons?offset=0&limit=20" \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Should return paginated list with count, next, previous, and results array
```

#### Test Get Pokemon Detail
```bash
# Get specific pokemon by ID
curl -X GET "http://localhost:3001/api/v1/pokemons/1" \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Should return detailed pokemon information
```

#### Test Logout
```bash
# Logout
curl -X POST http://localhost:3001/api/v1/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Should return: {"success":true,"message":"Logged out successfully"}
```

#### Test Unauthorized Access
```bash
# Try to access pokemons without login (should fail)
curl -X GET "http://localhost:3001/api/v1/pokemons" \
  -H "Content-Type: application/json"

# Should return: {"error":"Unauthorized"} with status 401
```

## 🧪 Automated Testing with RSpec

### Setup RSpec

```bash
cd backend
bundle install
rails generate rspec:install
```

### Run Tests

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/services/pokeapi_service_spec.rb

# Run with output
bundle exec rspec --format documentation
```

## 📝 Test Examples

### Using httpie (if installed)

```bash
# Install httpie: brew install httpie (macOS) or pip install httpie

# Login
http POST localhost:3001/api/v1/login username=admin password=admin

# Get pokemons
http GET localhost:3001/api/v1/pokemons offset==0 limit==20

# Get pokemon detail
http GET localhost:3001/api/v1/pokemons/1
```

### Using Postman

1. Import collection or create requests manually
2. Set base URL: `http://localhost:3001/api/v1`
3. Test endpoints in this order:
   - POST `/login` (save session cookie)
   - GET `/pokemons?offset=0&limit=20`
   - GET `/pokemons/1`
   - POST `/logout`

## ✅ Expected Responses

### Login Success
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "admin"
  }
}
```

### Pokemons List
```json
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "bulbasaur",
      "number": 1,
      "image_url": "https://...",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    }
  ]
}
```

### Pokemon Detail
```json
{
  "id": 1,
  "name": "bulbasaur",
  "number": 1,
  "image_url": "https://...",
  "height": 7,
  "weight": 69,
  "base_experience": 64,
  "types": ["grass", "poison"],
  "abilities": [...],
  "moves": [...],
  "forms": [...],
  "stats": [...]
}
```

## 🔍 Troubleshooting

### Server won't start
- Check if port 3001 is available: `lsof -i :3001`
- Check Ruby version: `ruby -v` (should be 3.4.6)
- Check Rails version: `rails -v` (should be 7.1.0)
- Check dependencies: `bundle install`

### CORS errors
- Verify CORS is configured in `config/application.rb`
- Check frontend is using correct API URL

### Authentication fails
- Verify session cookies are being sent
- Check `withCredentials: true` in frontend axios config
- Clear cookies and try again
