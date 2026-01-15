import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, pokemonApi, LoginCredentials } from './api';

// Query keys
export const queryKeys = {
  pokemons: (offset: number, limit: number) => ['pokemons', offset, limit] as const,
  pokemon: (id: number | string) => ['pokemon', id] as const,
};

// Pokemon queries
export function usePokemons(offset: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: queryKeys.pokemons(offset, limit),
    queryFn: () => pokemonApi.getPokemons(offset, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

export function usePokemon(id: number | string) {
  return useQuery({
    queryKey: queryKeys.pokemon(id),
    queryFn: () => pokemonApi.getPokemon(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Auth mutations
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      // Invalidate pokemon queries on successful login
      queryClient.invalidateQueries({ queryKey: ['pokemons'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
}
