import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemons, useLogout } from '@/lib/queries';
import { authStorage } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import PokemonCard from '@/components/PokemonCard';
import ListHeader, { SortOption } from '@/components/ListHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { API_CONFIG, UI_CONFIG } from '@/constants/config';

export default function ListPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, API_CONFIG.DEBOUNCE_DELAY);
  const [sortBy, setSortBy] = useState<SortOption>('number');
  const [offset, setOffset] = useState<number>(API_CONFIG.DEFAULT_OFFSET);
  const limit = API_CONFIG.DEFAULT_LIMIT;

  useEffect(() => {
    setOffset(0);
  }, [searchQuery, sortBy]);

  const sortByParam = sortBy === 'number' ? 'id' : sortBy;
  const searchParam = searchQuery.trim() || undefined;

  const { data, isLoading, error: queryError } = usePokemons(offset, limit, searchParam, sortByParam);
  const logoutMutation = useLogout();

  const pokemons = data?.results || [];
  const hasNext = !!data?.next;
  const hasPrevious = !!data?.previous;
  const totalCount = data?.count || 0;
  const error = queryError?.message || '';

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Error is handled by the mutation, just proceed with logout
    }
    authStorage.clear();
    navigate('/login');
  };


  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-primary border-4 border-primary overflow-hidden">
        <div className="mx-auto w-full flex flex-col flex-1 min-h-0" style={{ maxWidth: UI_CONFIG.MAX_CONTENT_WIDTH }}>
          <ListHeader
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            onSearchClear={() => setSearchInput('')}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onLogout={handleLogout}
            isLoggingOut={logoutMutation.isPending}
          />

          <main className="flex-1 overflow-y-auto bg-gray-white rounded-lg">
            <div className="px-4 sm:px-6 py-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-body2">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-body1 text-gray-medium">Loading pokemons...</p>
              </div>
            ) : (
              <>
                {pokemons.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                    {pokemons.map((pokemon) => (
                      <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-body1 text-gray-medium">No pokemons found</p>
                  </div>
                )}

                {(hasNext || hasPrevious) && (
                  <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                      onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                      disabled={!hasPrevious || isLoading}
                      className="px-4 py-2 text-body2 text-gray-dark bg-gray-white border border-gray-light rounded-lg hover:bg-gray-light disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary shadow-drop"
                    >
                      Previous
                    </button>
                    <span className="text-body2 text-gray-medium">
                      Page {Math.floor(offset / limit) + 1}{totalCount > 0 ? ` of ${Math.ceil(totalCount / limit)}` : ''}
                    </span>
                    <button
                      onClick={() => setOffset((prev) => prev + limit)}
                      disabled={!hasNext || isLoading}
                      className="px-4 py-2 text-body2 text-gray-dark bg-gray-white border border-gray-light rounded-lg hover:bg-gray-light disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary shadow-drop"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
