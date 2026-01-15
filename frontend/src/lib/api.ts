const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Fetch helper with credentials support
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    username: string;
  };
}

export interface PokemonListItem {
  id: number;
  name: string;
  number: number;
  image_url: string;
}

export interface PokemonsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  number: number;
  image_url: string;
  height: number;
  weight: number;
  base_experience: number;
  types: string[];
  abilities: Array<{
    name: string;
    is_hidden: boolean;
    slot: number;
  }>;
  moves: Array<{
    name: string;
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: string;
      version_group: string;
    }>;
  }>;
  forms: Array<{
    name: string;
    url: string;
  }>;
  stats: Array<{
    name: string;
    base_stat: number;
    effort: number;
  }>;
}

// API functions for React Query
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  logout: async (): Promise<void> => {
    await fetchApi('/logout', {
      method: 'POST',
    });
  },
};

export const pokemonApi = {
  getPokemons: async (
    offset: number = 0,
    limit: number = 20,
    search?: string,
    sortBy?: string
  ): Promise<PokemonsResponse> => {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    if (sortBy && sortBy !== 'default') {
      params.append('sort_by', sortBy);
    }
    
    return fetchApi<PokemonsResponse>(`/pokemons?${params.toString()}`);
  },
  
  getPokemon: async (id: number | string): Promise<PokemonDetail> => {
    return fetchApi<PokemonDetail>(`/pokemons/${id}`);
  },
};
