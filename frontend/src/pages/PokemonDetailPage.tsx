import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '@/lib/queries';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, isLoading, error } = usePokemon(id!);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type.toLowerCase()] || 'bg-gray-400';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 font-medium mr-4"
              >
                ← Back to List
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Pokemon Details</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading pokemon details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error.message || 'Failed to load pokemon details'}
            </div>
          ) : pokemon ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-48 h-48 mb-4 md:mb-0 md:mr-8 flex items-center justify-center">
                    <img
                      src={pokemon.image_url}
                      alt={pokemon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-bold text-white capitalize mb-2">
                      {pokemon.name}
                    </h2>
                    <p className="text-primary-100 text-lg mb-4">#{pokemon.number}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`${getTypeColor(type)} text-white px-4 py-1 rounded-full text-sm font-semibold capitalize`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 space-y-6">
                {/* Basic Stats */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Height</p>
                      <p className="text-lg font-semibold">{pokemon.height / 10}m</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Weight</p>
                      <p className="text-lg font-semibold">{pokemon.weight / 10}kg</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Base Experience</p>
                      <p className="text-lg font-semibold">{pokemon.base_experience}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Stats</p>
                      <p className="text-lg font-semibold">
                        {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Base Stats */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Base Stats</h3>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {stat.name.replace('-', ' ')}
                          </span>
                          <span className="text-sm font-semibold">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Abilities */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Abilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pokemon.abilities.map((ability, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 capitalize">
                            {ability.name.replace('-', ' ')}
                          </span>
                          {ability.is_hidden && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Slot: {ability.slot}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Moves */}
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Moves ({pokemon.moves.length})
                  </h3>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {pokemon.moves.map((move, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm"
                        >
                          <p className="font-medium text-gray-900 capitalize">
                            {move.name.replace('-', ' ')}
                          </p>
                          {move.version_group_details.length > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                              Level {move.version_group_details[0].level_learned_at}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Forms */}
                {pokemon.forms.length > 1 && (
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Forms</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {pokemon.forms.map((form, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <p className="font-semibold text-gray-900 capitalize">
                            {form.name.replace('-', ' ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </ProtectedRoute>
  );
}
