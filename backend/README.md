# Pokemon API Backend

Ruby on Rails API that proxies requests to PokeAPI.

## Requirements

- Ruby 3.4.6
- Rails 7.1.0

## Setup

1. **If using rbenv**, make sure it's initialized in your shell:
   ```bash
   # Add to your ~/.zshrc or ~/.bashrc:
   eval "$(rbenv init - zsh)"  # or `bash` for bash
   
   # Then set Ruby version for this project:
   rbenv local 3.4.6
   ```

2. Install dependencies:
```bash
bundle install
```

3. Create `.env` file (optional, uses defaults if not present):
```bash
cp .env.example .env
```

4. Start the server:
```bash
# With rbenv/bundler, use bundle exec:
bundle exec rails server -p 3001

# Or if Rails is installed globally:
rails server -p 3001
```

## Environment Variables

- `POKEAPI_BASE_URL` (optional) - REST API base URL (default: `https://pokeapi.co/api/v2`)
- `POKEAPI_GRAPHQL_URL` (optional) - GraphQL endpoint (default: `https://beta.pokeapi.co/graphql/v1beta`)

## Endpoints

- `POST /api/v1/login` - Login with admin/admin credentials
- `GET /api/v1/pokemons` - Get paginated Pokemon list (uses GraphQL)
  - Query params: `offset` (min: 0), `limit` (1-100), `search`, `sort_by` (name|id)
- `GET /api/v1/pokemons/:id` - Get Pokemon details (uses REST API)

## Notes

- **No database required** - uses PokeAPI as source of truth
- **GraphQL** used for Pokemon list (filtering, sorting, pagination)
- **REST API** used for Pokemon details
- **Session-based authentication** using cookies (24-hour expiration)
- **Parameter validation** on all endpoints (offset, limit ranges)
- **Optimized responses** - only returns fields used by frontend
- **CORS enabled** for frontend communication

