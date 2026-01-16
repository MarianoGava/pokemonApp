import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '@/lib/queries';
import ProtectedRoute from '@/components/ProtectedRoute';
import BaseStats from '@/components/BaseStats';
import { typeColors } from '@/constants/typeColors';
import backArrow from '@/assets/icons/back-arrow.svg';
import pokeballIcon from '@/assets/icons/pokeball.svg';

interface HeaderProps {
  pokemonName?: string;
  pokemonNumber?: number;
  primaryColorClass: string;
  primaryColorHex: string;
}

function Header({ pokemonName, pokemonNumber, primaryColorClass, primaryColorHex }: HeaderProps) {
  return (
    <header className={`${primaryColorClass} text-gray-white shadow-drop relative overflow-hidden h-[220px] flex-shrink-0`}>
        <img 
          src={pokeballIcon} 
          alt="Pokeball background" 
          className="absolute right-2 top-2 w-auto brightness-0 invert opacity-10 h-[200px]"
        />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-gray-white hover:text-gray-light font-bold mr-4 text-body1"
          >
            <img src={backArrow} alt="Back" className="w-6 h-6" />
          </Link>
          <h1 className="text-h1 text-gray-white capitalize">{pokemonName}</h1>
        </div>
        <div className="flex items-center">
          <p className="text-subtitle2 text-gray-white">#{String(pokemonNumber).padStart(3, '0')}</p>
        </div>
      </div>
    </header>
  );
}

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, isLoading, error } = usePokemon(id!);

  const getTypeColorClass = (type: string) => {
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

  const getTypeColorHex = (type: string): string => {
    const typeLower = type.toLowerCase() as keyof typeof typeColors;
    return typeColors[typeLower] || typeColors.normal;
  };

  const getPrimaryTypeColorClass = () => {
    if (!pokemon?.types?.length) return 'bg-primary';
    return getTypeColorClass(pokemon.types[0]);
  };

  const getPrimaryTypeColorHex = (): string => {
    if (!pokemon?.types?.length) return '#DC0A2D';
    return getTypeColorHex(pokemon.types[0]);
  };

  const primaryColorHex = getPrimaryTypeColorHex();
  const primaryColorClass = getPrimaryTypeColorClass();

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: primaryColorHex }}>
        <Header
          pokemonName={pokemon?.name}
          pokemonNumber={pokemon?.number}
          primaryColorClass={primaryColorClass}
          primaryColorHex={primaryColorHex}
        />

        <div className="relative mx-1 mb-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: primaryColorHex }}></div>
                <p className="mt-4 text-body1" style={{ color: primaryColorHex }}>Loading pokemon details...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-body2">
                {error.message || 'Failed to load pokemon details'}
              </div>
            ) : pokemon ? (
              <>
                <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-48 h-48 flex items-center justify-center z-10">
                  <img
                    src={pokemon.image_url}
                    alt={pokemon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              
              <div className="bg-gray-white rounded-lg shadow-drop overflow-hidden">

                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-wrap mt-24 gap-2 justify-center md:justify-start">
                        {pokemon.types.map((type) => (
                          <span
                            key={type}
                            className={`${getTypeColorClass(type)} text-gray-white px-4 py-2 rounded-full text-body2 font-bold capitalize`}
                          >
                            {type}
                          </span>
                        ))}
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

                  <BaseStats stats={pokemon.stats} primaryColorHex={primaryColorHex} />

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
              </>
            ) : null}
        </div>
      </div>
    </ProtectedRoute>
  );
}
