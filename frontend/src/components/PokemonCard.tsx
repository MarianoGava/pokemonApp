import { memo } from 'react';
import { Link } from 'react-router-dom';
import { PokemonListItem } from '@/lib/api';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="bg-gray-white h-[108px] w-full rounded-lg shadow-card flex flex-col justify-between relative"
    >
      <p className="font-poppins text-gray-medium text-caption text-right mt-2 mr-2">
        #{String(pokemon.number).padStart(3, '0')}
      </p>
      <div className="absolute top-1/2 left-0 right-0 h-[72px] flex items-center justify-center z-10 transform -translate-y-1/2">
        <img
          src={pokemon.image_url}
          alt={pokemon.name}
          className="object-contain max-h-[72px] max-w-[72px]"
          width="72"
          height="72"
          loading="lazy"
        />
      </div>
      <div className="bg-gray-background h-[44px] rounded-lg z-0 flex flex-col items-center justify-end">
        <h3 className="text-[10px] font-poppins text-gray-dark capitalize z-10 text-center mb-1">
          {pokemon.name}
        </h3>
      </div>
    </Link>
  );
}

export default memo(PokemonCard);
