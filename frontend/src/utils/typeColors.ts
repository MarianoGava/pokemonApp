import { typeColors } from '@/constants/typeColors';

export const getTypeColorClass = (type: string): string => {
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

export const getTypeColorHex = (type: string): string => {
  const typeLower = type.toLowerCase() as keyof typeof typeColors;
  return typeColors[typeLower] || typeColors.normal;
};
