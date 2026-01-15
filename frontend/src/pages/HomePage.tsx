import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePokemons, useLogout } from '@/lib/queries';
import { authStorage } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useDebounce } from '@/hooks/useDebounce';

type SortOption = 'name' | 'number' | 'default';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, 500);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    setOffset(0);
  }, [searchQuery, sortBy]);

  const sortByParam = sortBy === 'default' ? undefined : (sortBy === 'number' ? 'id' : sortBy);
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
    } catch (err) {
      console.error('Logout error:', err);
    }
    authStorage.clear();
    navigate('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Pokemon App</h1>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or number..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="name">Name</option>
                <option value="number">Number</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading pokemons...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {searchQuery
                  ? `Found ${pokemons.length} pokemon(s)${totalCount > pokemons.length ? ` (showing page results)` : ''}`
                  : `Showing ${offset + 1}-${Math.min(offset + limit, totalCount)} of ${totalCount} pokemons`}
                {searchInput !== searchQuery && searchInput && (
                  <span className="ml-2 text-gray-400 italic">(typing...)</span>
                )}
              </div>

              {pokemons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pokemons.map((pokemon) => (
                    <Link
                      key={pokemon.id}
                      to={`/pokemon/${pokemon.id}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer transform hover:scale-105 transition-transform"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 mb-4 flex items-center justify-center">
                          <img
                            src={pokemon.image_url}
                            alt={pokemon.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize mb-1">
                          {pokemon.name}
                        </h3>
                        <p className="text-sm text-gray-500">#{pokemon.number}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600">No pokemons found</p>
                </div>
              )}

              {(hasNext || hasPrevious) && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                    disabled={!hasPrevious || isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {Math.floor(offset / limit) + 1}{totalCount > 0 ? ` of ${Math.ceil(totalCount / limit)}` : ''}
                  </span>
                  <button
                    onClick={() => setOffset((prev) => prev + limit)}
                    disabled={!hasNext || isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
