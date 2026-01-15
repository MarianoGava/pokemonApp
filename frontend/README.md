# Pokemon App Frontend

React SPA application with TypeScript, React Router, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, uses defaults if not present):
```bash
cp .env.example .env
```

Or create it manually:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3001/api/v1`)

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
├── components/
│   └── ProtectedRoute.tsx    # Route protection component
├── lib/
│   ├── api.ts                # API functions and TypeScript interfaces
│   ├── queries.ts            # React Query hooks and query keys
│   └── auth.ts               # Authentication utilities
├── pages/
│   ├── LoginPage.tsx         # Login page
│   ├── ListPage.tsx          # Main Pokemon list page
│   └── PokemonDetailPage.tsx # Pokemon detail page
├── App.tsx                   # Main app component with routes
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Features

- Login page with validation
- Protected routes (redirects if not authenticated)
- Pokemon list with search and sorting
- Pagination
- Pokemon detail view with abilities, moves, and forms
- Responsive design
- Loading states and error handling
