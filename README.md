# Pokemon App - Full Stack Technical Challenge

A full-stack Pokemon application built with **React SPA (TypeScript + React Router)** frontend and **Ruby on Rails** backend, following the requirements from the technical interview exercise.

## 🎯 Project Overview

This application allows users to:
- **Login** with credentials (admin/admin)
- **Browse** a paginated list of Pokemon from PokeAPI
- **Search** Pokemon by name or ID (server-side filtering)
- **Sort** Pokemon by name or number (server-side sorting)
- **View detailed information** about each Pokemon including stats, abilities, and types

## 🏗️ Architecture

### Backend (Ruby on Rails)
- **API-only** Rails application
- Uses **GraphQL** for Pokemon list (filtering, sorting, pagination)
- Uses **REST API** for Pokemon details
- Session-based authentication with 24-hour expiration
- Parameter validation (offset, limit, search, sort_by)
- No local database required (uses PokeAPI as source of truth)

### Frontend (React SPA + TypeScript)
- **React 18.3** with React Router 6
- **Vite** as build tool and dev server
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom design system
- **TanStack React Query** for data fetching and caching
- **Protected routes** with authentication
- **Debounced search** input (500ms delay)
- **React.memo** for performance optimization
- Responsive design (mobile-first, max-width: 780px)

## 📋 Requirements Implementation

### ✅ Backend Endpoints
- `POST /api/v1/login` - Handle credentials authorization (admin/admin)
- `GET /api/v1/pokemons` - Paginated list with search and sorting (uses GraphQL)
  - Query params: `offset`, `limit`, `search`, `sort_by`
- `GET /api/v1/pokemons/:id` - Detailed Pokemon information (uses REST)

### ✅ Frontend Features
- Login screen with form validation
- Protected routes with automatic redirect on 401
- Main page with debounced search and sort modal
- Server-side pagination, filtering, and sorting
- Pokemon detail view with:
  - Base stats with progress bars
  - About section (height, weight, abilities)
  - Dynamic color theming based on Pokemon type
- Responsive design with max-width container (780px)
- Loading states and error handling

## 🚀 Getting Started

### Prerequisites
- Ruby 3.4.6
- Rails 7.1.0
- Node.js 18+ and npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
bundle install
```

3. Start the Rails server:
```bash
rails server -p 3001
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_AUTH_KEY=pokemon_app_auth
```

**Note:** `VITE_AUTH_KEY` is optional (defaults to 'pokemon_app_auth'), but `VITE_API_URL` is required.

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Login Credentials
- **Username:** `admin`
- **Password:** `admin`

## 📁 Project Structure

```
pokemonApp/
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── api/v1/
│   │   │   │   ├── auth_controller.rb      # Login endpoint
│   │   │   │   └── pokemons_controller.rb  # Pokemon endpoints
│   │   │   └── application_controller.rb
│   │   └── services/
│   │       └── pokeapi_service.rb          # PokeAPI integration
│   └── config/
│       ├── routes.rb
│       └── application.rb
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx               # Login page
│   │   │   ├── PokemonList.tsx             # Main Pokemon list page
│   │   │   └── PokemonDetailPage.tsx       # Pokemon detail page
│   │   ├── components/
│   │   │   ├── AboutSection.tsx            # About section component
│   │   │   ├── BaseStats.tsx               # Base stats component
│   │   │   ├── ListHeader.tsx              # List page header
│   │   │   ├── PokemonCard.tsx             # Pokemon card component
│   │   │   ├── ProtectedRoute.tsx          # Route protection
│   │   │   └── SortModal.tsx               # Sort options modal
│   │   ├── constants/
│   │   │   ├── config.ts                   # App configuration constants
│   │   │   └── typeColors.ts               # Pokemon type colors
│   │   ├── hooks/
│   │   │   └── useDebounce.ts              # Debounce hook
│   │   ├── lib/
│   │   │   ├── api.ts                      # API client
│   │   │   ├── auth.ts                     # Auth utilities
│   │   │   └── queries.ts                  # React Query hooks
│   │   ├── utils/
│   │   │   └── typeColors.ts               # Type color utilities
│   │   ├── App.tsx                         # Main app with routes
│   │   ├── main.tsx                        # Entry point
│   │   └── index.css                       # Global styles
│   ├── index.html                          # HTML template
│   └── vite.config.ts                      # Vite configuration
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
bundle exec rspec
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🎨 Design Notes

The application follows a mobile-first responsive design approach with a maximum content width of 780px on desktop:
- **Custom design system** with defined colors, typography, and shadows
- **Dynamic color theming** based on Pokemon type
- **Responsive grid layouts** (3 columns on mobile)
- **Fixed headers** with scrollable content areas
- **Smooth transitions** and hover effects
- **Accessible form inputs** and buttons with proper ARIA labels
- **Loading states** and comprehensive error handling
- **Optimized images** using PokeAPI's high-quality sprites

## 🔧 Technologies Used

### Backend
- Ruby on Rails 7.1.0
- HTTParty (for PokeAPI integration)
- Rack-CORS (for CORS handling)
- Session-based authentication

### Frontend
- React 18.3
- React Router 6
- Vite
- TypeScript
- Tailwind CSS
- TanStack React Query (for data fetching and caching)

## 📝 API Documentation

### Authentication

#### POST /api/v1/login
Login with credentials.

**Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "admin"
  }
}
```

### Pokemon Endpoints

#### GET /api/v1/pokemons
Get paginated list of Pokemon with optional filtering and sorting.

**Query Parameters:**
- `offset` (optional): Starting index, min: 0 (default: 0)
- `limit` (optional): Number of results, range: 1-100 (default: 20)
- `search` (optional): Search by name or ID (filters server-side)
- `sort_by` (optional): Sort by `name` or `id` (default: `id`)

**Response:**
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

#### GET /api/v1/pokemons/:id
Get detailed Pokemon information.

**Response:**
```json
{
  "id": 1,
  "name": "bulbasaur",
  "number": 1,
  "image_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  "height": 7,
  "weight": 69,
  "types": ["grass", "poison"],
  "abilities": [
    { "name": "overgrow" }
  ],
  "stats": [
    { "name": "hp", "base_stat": 45 },
    { "name": "attack", "base_stat": 49 }
  ]
}
```

**Note:** The response only includes fields used by the frontend. `moves` and `forms` are not included for performance.

---

## 🚀 Performance Optimizations

The application includes several performance optimizations:

### Frontend
- **React.memo** on reusable components (PokemonCard, AboutSection, BaseStats)
- **Debounced search** (500ms) to reduce API calls
- **React Query** caching with configurable stale/gc times
- **Lazy loading** images with `loading="lazy"`
- **Optimized payloads** - only fetches necessary data from backend
- **Centralized constants** for maintainability

### Backend
- **GraphQL** for efficient list queries (only fetches needed fields)
- **Parameter validation** prevents invalid requests
- **Optimized data transformation** - excludes unused fields (moves, forms, base_experience)
- **Error handling** with appropriate HTTP status codes

---

## 🚧 Future Enhancements

- [ ] Add integration tests
- [ ] Implement caching for Pokemon data besides react query cache
- [ ] Add favorite Pokemon feature


