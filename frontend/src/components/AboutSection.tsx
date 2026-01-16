import { memo } from 'react';
import weightIcon from '@/assets/icons/weigth.svg';
import heightIcon from '@/assets/icons/height.svg';
import { PokemonDetail } from '@/lib/api';

interface AboutSectionProps {
  pokemon: PokemonDetail;
  primaryColorHex: string;
}

function AboutSection({ pokemon, primaryColorHex }: AboutSectionProps) {
  return (
    <section>
      <h3 className="text-subtitle1 text-gray-dark mb-6 text-center" style={{ color: primaryColorHex }}>About</h3>
      <div className="flex items-start flex-row h-[48px]">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2">
            <img src={weightIcon} alt="Weight" className="mb-2" />
            <p className="text-body2 text-gray-dark mb-1">{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
          <p className="text-caption text-gray-medium">Weight</p>
        </div>

        <div className="w-px bg-gray-300 h-full mx-4" />

        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2">
            <img src={heightIcon} alt="Height" className="mb-2" />
            <p className="text-body2 text-gray-dark mb-1">{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <p className="text-caption text-gray-medium">Height</p>
        </div>

        <div className="w-px bg-gray-300 h-full mx-4" />

        <div className="flex-1 flex flex-col items-center">
          <div className="mb-2 flex flex-col items-center gap-1">
            {pokemon.abilities.slice(0, 2).map((ability, index) => (
              <p key={index} className="text-body2 text-gray-dark capitalize">
                {ability.name.replace('-', ' ')}
              </p>
            ))}
          </div>
          <p className="text-caption text-gray-medium">Moves</p>
        </div>
      </div>
      <div className="flex mt-6 text-body2 items-center justify-center gap-2 leading-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
    </section>
  );
}

export default memo(AboutSection);
