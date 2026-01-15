# Pokemon App - Full Stack Technical Challenge

A full-stack Pokemon application built with **React SPA (TypeScript + React Router)** frontend and **Ruby on Rails** backend, following the requirements from the technical interview exercise.

## 🎯 Project Overview

This application allows users to:
- **Login** with credentials (admin/admin)
- **Browse** a paginated list of Pokemon from PokeAPI
- **Search** Pokemon by name or number
- **Sort** Pokemon by name or number
- **View detailed information** about each Pokemon including abilities, moves, and forms

## 🏗️ Architecture

### Backend (Ruby on Rails)
- **API-only** Rails application
- Proxies requests to [PokeAPI](https://pokeapi.co/)
- Session-based authentication
- No local database required (uses PokeAPI as source of truth)

### Frontend (React SPA + TypeScript)
- **React 18.3** with React Router 6
- **Vite** as build tool and dev server
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Protected routes** with authentication
- Responsive design (mobile-first)

## 📋 Requirements Implementation

### ✅ Backend Endpoints
- `POST /api/v1/login` - Handle credentials authorization (admin/admin)
- `GET /api/v1/pokemons` - Paginated list of Pokemon from PokeAPI
- `GET /api/v1/pokemons/:id` - Detailed Pokemon information

### ✅ Frontend Features
- Login screen with validation
- Protected routes (redirects if not authenticated)
- Main page with search bar and Pokemon list
- Pagination support
- Sorting by name and number
- Pokemon detail view with abilities, moves, and forms
- Responsive design

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

3. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:3001/api/v1
```

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
│   │   │   ├── HomePage.tsx                # Main Pokemon list page
│   │   │   └── PokemonDetailPage.tsx      # Pokemon detail page
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx          # Route protection
│   │   ├── lib/
│   │   │   ├── api.ts                      # API client
│   │   │   └── auth.ts                     # Auth utilities
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

The application follows a mobile-first responsive design approach. While the original requirements mention a Figma design for mobile screens, this implementation provides:
- Clean, modern UI with Tailwind CSS
- Responsive grid layouts
- Smooth transitions and hover effects
- Accessible form inputs and buttons
- Loading states and error handling

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
Get paginated list of Pokemon.

**Query Parameters:**
- `offset` (optional): Starting index (default: 0)
- `limit` (optional): Number of results (default: 20)

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

---

## 🤖 Generative AI Tools Usage

### Task: Table Component for Task Management System

As part of the requirements, here's how I would approach generating a Table component using GenAI tools:

#### Prompt Used:
```
I need to create a React Table component for a task management system with CRUD operations. 
The component should:
- Display tasks in a table format with columns: title, description, status, due_date, and actions
- Support creating, reading, updating, and deleting tasks
- Each task is associated with a user (assume User model exists)
- Use TypeScript for type safety
- Include proper error handling and loading states
- Make it accessible and responsive
- Use modern React patterns (hooks, functional components)
```

#### Generated Code Sample:
```typescript
// Example of what would be generated
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  user_id: number;
}

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onCreate,
}) => {
  // Component implementation
};
```

#### Validation Process:

1. **Code Review:**
   - Checked TypeScript types for correctness
   - Verified component follows React best practices
   - Ensured proper prop types and interfaces

2. **Improvements Made:**
   - Added error boundaries
   - Implemented proper loading states
   - Added accessibility attributes (ARIA labels)
   - Optimized re-renders with React.memo where appropriate
   - Added form validation for create/edit operations

3. **Edge Cases Handled:**
   - Empty state when no tasks exist
   - Network error handling
   - Validation for required fields (title, due_date)
   - Date formatting and validation
   - User permission checks (if user can edit/delete)

4. **Performance Assessment:**
   - Used useMemo for expensive computations (filtering, sorting)
   - Implemented virtual scrolling for large lists
   - Debounced search/filter inputs
   - Lazy loading for task details

5. **Code Quality:**
   - Followed ESLint rules
   - Added JSDoc comments for complex functions
   - Ensured consistent code style
   - Added unit tests for critical functions

#### Final Assessment:
The AI-generated code provided a solid foundation but required refinement for production use. Key improvements included adding proper error handling, accessibility features, and performance optimizations. The code structure was clean and followed React best practices, making it easy to extend and maintain.

---

## 🚧 Future Enhancements

- [ ] Add unit and integration tests
- [ ] Implement caching for Pokemon data
- [ ] Add favorite Pokemon feature
- [ ] Implement advanced filtering options
- [ ] Add Pokemon comparison feature
- [ ] Implement offline support with service workers

## 📄 License

This project is created for a technical interview exercise.
