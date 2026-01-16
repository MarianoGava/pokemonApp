import { PokemonListItem, PokemonDetail } from '@/lib/api';

export const mockPokemonListItem: PokemonListItem = {
  id: 1,
  name: 'bulbasaur',
  number: 1,
  image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
};

export const mockPokemonDetail: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  number: 1,
  image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
  height: 7,
  weight: 69,
  types: ['grass', 'poison'],
  abilities: [
    { name: 'overgrow' },
    { name: 'chlorophyll' },
  ],
  stats: [
    { name: 'hp', base_stat: 45 },
    { name: 'attack', base_stat: 49 },
    { name: 'defense', base_stat: 49 },
    { name: 'special-attack', base_stat: 65 },
    { name: 'special-defense', base_stat: 65 },
    { name: 'speed', base_stat: 45 },
  ],
};

export const mockPokemonsList: PokemonListItem[] = [
  mockPokemonListItem,
  {
    id: 2,
    name: 'ivysaur',
    number: 2,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
  },
  {
    id: 3,
    name: 'venusaur',
    number: 3,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
  },
];
