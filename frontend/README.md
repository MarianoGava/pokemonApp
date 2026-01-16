# Pokemon App Frontend

React SPA application with TypeScript, React Router, and Tailwind CSS. Features server-side filtering, sorting, and pagination with optimized performance.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
# Required
VITE_API_URL=http://localhost:3001/api/v1

# Optional (defaults to 'pokemon_app_auth')
VITE_AUTH_KEY=pokemon_app_auth
```

## Environment Variables

- `VITE_API_URL` (required) - Backend API base URL
- `VITE_AUTH_KEY` (optional) - LocalStorage key for auth data (default: `pokemon_app_auth`)

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Styling
- **TanStack React Query** - Data fetching, caching, and synchronization

## Project Structure

```
src/
├── assets/
│   └── icons/                # SVG icons (pokeball, search, sort, etc.)
├── components/
│   ├── AboutSection.tsx      # Pokemon about section
│   ├── BaseStats.tsx         # Base stats with progress bars
│   ├── ListHeader.tsx        # List page header with search/sort
│   ├── PokemonCard.tsx       # Pokemon card component
│   ├── ProtectedRoute.tsx    # Route protection
│   └── SortModal.tsx         # Sort options modal
├── constants/
│   ├── config.ts             # App configuration (API config, UI config)
│   └── typeColors.ts         # Pokemon type color definitions
├── hooks/
│   └── useDebounce.ts        # Debounce hook for search input
├── lib/
│   ├── api.ts                # API client and TypeScript interfaces
│   ├── auth.ts               # Authentication utilities
│   └── queries.ts            # React Query hooks and query keys
├── pages/
│   ├── LoginPage.tsx         # Login page
│   ├── PokemonList.tsx       # Main Pokemon list page
│   └── PokemonDetailPage.tsx # Pokemon detail page
├── utils/
│   └── typeColors.ts         # Type color utility functions
├── App.tsx                   # Main app component with routes
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Features

- **Authentication**: Login page with form validation, protected routes, automatic redirect on session expiration
- **Pokemon List**: 
  - Debounced search (500ms) by name or ID
  - Server-side filtering and sorting
  - Pagination with Previous/Next controls
  - Fixed header with scrollable content
- **Pokemon Detail**: 
  - Dynamic color theming based on Pokemon type
  - Base stats with visual progress bars
  - About section (height, weight, abilities)
  - Scrollable content with fixed header and image
- **Performance**: 
  - React.memo for component optimization
  - React Query for smart caching
  - Lazy-loaded images
- **Design**: 
  - Mobile-first responsive design
  - Max-width container (780px) on desktop
  - Custom design system (colors, typography, shadows)
  - Loading states and comprehensive error handling
