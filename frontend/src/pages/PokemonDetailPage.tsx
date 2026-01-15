import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '@/lib/queries';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, isLoading, error } = usePokemon(id!);

  const getTypeColor = (type: string) => {
    const typeLower = type.toLowerCase();
    const colorMap: Record<string, string> = {
      normal: 'bg-type-normal',
      fire: 'bg-type-fire',
      water: 'bg-type-water',
      electric: 'bg-type-electric',
      grass: 'bg-type-grass',
      ice: 'bg-type-ice',
      fighting: 'bg-type-fighting',
      poison: 'bg-type-poison',
      ground: 'bg-type-ground',
      flying: 'bg-type-flying',
      psychic: 'bg-type-psychic',
      bug: 'bg-type-bug',
      rock: 'bg-type-rock',
      ghost: 'bg-type-ghost',
      dragon: 'bg-type-dragon',
      dark: 'bg-type-dark',
      steel: 'bg-type-steel',
      fairy: 'bg-type-fairy',
    };
    return colorMap[typeLower] || 'bg-type-normal';
  };

  const getPrimaryTypeColor = () => {
    if (!pokemon?.types?.length) return 'bg-primary';
    return getTypeColor(pokemon.types[0]);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-background">
        <header className={`${pokemon ? getPrimaryTypeColor() : 'bg-primary'} text-gray-white shadow-drop`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-gray-white hover:text-gray-light font-bold mr-4 text-body1"
              >
                ← Back
              </Link>
              {pokemon && (
                <div className="flex-1">
                  <h1 className="text-h1 text-gray-white capitalize">{pokemon.name}</h1>
                  <p className="text-subtitle1 text-gray-white">#{String(pokemon.number).padStart(3, '0')}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-body1 text-gray-medium">Loading pokemon details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-body2">
              {error.message || 'Failed to load pokemon details'}
            </div>
          ) : pokemon ? (
            <div className="bg-gray-white rounded-lg shadow-drop overflow-hidden">
              <div className={`${getPrimaryTypeColor()} px-6 py-8`}>
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-48 h-48 mb-4 md:mb-0 md:mr-8 flex items-center justify-center">
                    <img
                      src={pokemon.image_url}
                      alt={pokemon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`${getTypeColor(type)} text-gray-white px-4 py-2 rounded-full text-body2 font-bold capitalize`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-subtitle1 text-gray-dark mb-4">About</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-background p-4 rounded-lg">
                      <p className="text-body2 text-gray-medium mb-1">Height</p>
                      <p className="text-body1 font-bold text-gray-dark">{(pokemon.height / 10).toFixed(1)}m</p>
                    </div>
                    <div className="bg-gray-background p-4 rounded-lg">
                      <p className="text-body2 text-gray-medium mb-1">Weight</p>
                      <p className="text-body1 font-bold text-gray-dark">{(pokemon.weight / 10).toFixed(1)}kg</p>
                    </div>
                    <div className="bg-gray-background p-4 rounded-lg">
                      <p className="text-body2 text-gray-medium mb-1">Base Experience</p>
                      <p className="text-body1 font-bold text-gray-dark">{pokemon.base_experience}</p>
                    </div>
                    <div className="bg-gray-background p-4 rounded-lg">
                      <p className="text-body2 text-gray-medium mb-1">Total Stats</p>
                      <p className="text-body1 font-bold text-gray-dark">
                        {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-subtitle1 text-gray-dark mb-4">Base Stats</h3>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => (
                      <div key={stat.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-body2 text-gray-dark capitalize">
                            {stat.name.replace('-', ' ')}
                          </span>
                          <span className="text-body2 font-bold text-gray-dark">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-light rounded-full h-2">
                          <div
                            className={`${getPrimaryTypeColor()} h-2 rounded-full`}
                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {pokemon.abilities.length > 0 && (
                  <section>
                    <h3 className="text-subtitle1 text-gray-dark mb-4">Abilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pokemon.abilities.map((ability, index) => (
                        <div
                          key={index}
                          className="bg-gray-background p-4 rounded-lg border border-gray-light"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-body1 font-bold text-gray-dark capitalize">
                              {ability.name.replace('-', ' ')}
                            </span>
                            {ability.is_hidden && (
                              <span className="text-caption bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
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
