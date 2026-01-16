# Backend Tests

## Setup

1. Install dependencies (including webmock for HTTP stubbing):
```bash
bundle install
```

2. Run tests:
```bash
bundle exec rspec
```

## Test Structure

### Services Tests (`spec/services/`)
- **`pokeapi_service_spec.rb`**: Tests for `PokeapiService`
  - GraphQL query building
  - Pagination handling
  - Search functionality (by name and ID)
  - Sorting functionality
  - Error handling (GraphQL errors, HTTP errors, network errors)

### Request Tests (`spec/requests/api/v1/`)
- **`auth_spec.rb`**: Tests for authentication endpoints
  - Login with valid/invalid credentials
  - Logout functionality
  - Session management
  - Edge cases (missing params, case sensitivity, etc.)

- **`pokemons_spec.rb`**: Tests for Pokemon endpoints
  - Pagination with parameter validation
  - Search functionality
  - Sorting functionality
  - Error handling
  - Authentication requirements

## Test Coverage

### PokeapiService
- ✅ `get_pokemons`:
  - Successful GraphQL queries
  - Pagination (offset, limit)
  - Search by name and ID
  - Sorting by name and id
  - GraphQL error handling
  - HTTP error handling
  - Network error handling
  - Empty search handling

- ✅ `get_pokemon`:
  - Successful REST API calls
  - Data transformation (types, abilities, stats)
  - Image URL generation
  - 404 error handling
  - Network error handling

- ✅ `build_graphql_query`:
  - Query construction with all parameters
  - Search query building
  - Sort query building
  - Quote escaping

### AuthController
- ✅ Login:
  - Valid credentials
  - Invalid credentials (wrong username, password, both)
  - Missing parameters
  - Case sensitivity
  - Session creation

- ✅ Logout:
  - Successful logout
  - Session clearing
  - Idempotency (can logout multiple times)

### PokemonsController
- ✅ Index (GET /api/v1/pokemons):
  - Pagination with defaults
  - Parameter validation (offset min: 0, limit: 1-100)
  - Search functionality
  - Sort functionality
  - Authentication requirement
  - Error handling (API errors → 502)

- ✅ Show (GET /api/v1/pokemons/:id):
  - Successful Pokemon retrieval
  - Invalid ID handling (404)
  - String ID handling
  - Authentication requirement
  - Error handling

## Running Tests

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/services/pokeapi_service_spec.rb

# Run specific test
bundle exec rspec spec/services/pokeapi_service_spec.rb:45

# Run with documentation format
bundle exec rspec --format documentation

# Run with coverage (if SimpleCov is configured)
COVERAGE=true bundle exec rspec
```

## Mocking Strategy

Tests use **WebMock** to stub HTTP requests:
- No real API calls are made during tests
- Tests are fast and reliable
- Network is disabled (except localhost)

## Notes

- All external HTTP requests are mocked using WebMock
- Tests don't require internet connection
- Tests are isolated and don't affect each other
- Session management is tested through Rails test helpers
