import { useParams, Link } from 'react-router-dom';
import { usePokemon } from '@/lib/queries';
import ProtectedRoute from '@/components/ProtectedRoute';
import BaseStats from '@/components/BaseStats';
import AboutSection from '@/components/AboutSection';
import { getTypeColorClass, getTypeColorHex } from '@/utils/typeColors';
import { UI_CONFIG } from '@/constants/config';
import backArrow from '@/assets/icons/back-arrow.svg';
import pokeballIcon from '@/assets/icons/pokeball.svg';

interface HeaderProps {
  pokemonName?: string;
  pokemonNumber?: number;
  primaryColorClass: string;
}

function Header({ pokemonName, pokemonNumber, primaryColorClass }: HeaderProps) {
  return (
    <header className={`${primaryColorClass} text-gray-white relative overflow-hidden h-[220px] flex-shrink-0`}>
        <img 
          src={pokeballIcon} 
          alt="Pokeball background" 
          className="absolute right-2 top-2 w-auto brightness-0 invert opacity-10 h-[200px]"
        />
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center relative z-10">
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
        <div className="mx-auto w-full flex flex-col flex-1" style={{ maxWidth: UI_CONFIG.MAX_CONTENT_WIDTH }}>
          <Header
            pokemonName={pokemon?.name}
            pokemonNumber={pokemon?.number}
            primaryColorClass={primaryColorClass}
          />

          <div className="relative mx-1 mb-1 flex-1 flex flex-col min-h-0">
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
                <div className="bg-gray-white rounded-lg shadow-drop flex flex-col flex-1 min-h-0 overflow-y-auto">
                    <div className="text-center flex-shrink-0">
                      <div className="flex flex-wrap mt-20 gap-2 justify-center">
                        {pokemon.types.map((type) => (
                          <span
                            key={type}
                            style={{ backgroundColor: getTypeColorHex(type) }}
                            className={`${getTypeColorClass(type)} text-gray-white px-4 py-2 rounded-full text-body2 font-bold capitalize`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <AboutSection
                        pokemon={pokemon}
                        primaryColorHex={primaryColorHex}
                      />
                      <BaseStats stats={pokemon.stats} primaryColorHex={primaryColorHex} />
                    </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
