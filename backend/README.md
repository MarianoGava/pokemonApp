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

- `POKEAPI_BASE_URL` - Base URL for PokeAPI (default: `https://pokeapi.co/api/v2`)

## Endpoints

- `POST /api/v1/login` - Login with admin/admin
- `GET /api/v1/pokemons` - Get paginated Pokemon list
- `GET /api/v1/pokemons/:id` - Get Pokemon details

## Notes

- No database required - uses PokeAPI as source of truth
- Session-based authentication using cookies
- CORS enabled for frontend communication

