import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/testUtils';
import AboutSection from '../AboutSection';
import { PokemonDetail } from '@/lib/api';

const mockPokemon: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  number: 1,
  image_url: 'https://example.com/bulbasaur.png',
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
  ],
};

describe('AboutSection', () => {
  it('should render About heading', () => {
    renderWithProviders(<AboutSection pokemon={mockPokemon} primaryColorHex="#74CB48" />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should display weight correctly', () => {
    renderWithProviders(<AboutSection pokemon={mockPokemon} primaryColorHex="#74CB48" />);
    expect(screen.getByText('6.9 kg')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
  });

  it('should display height correctly', () => {
    renderWithProviders(<AboutSection pokemon={mockPokemon} primaryColorHex="#74CB48" />);
    expect(screen.getByText('0.7 m')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeInTheDocument();
  });

  it('should display first two abilities', () => {
    renderWithProviders(<AboutSection pokemon={mockPokemon} primaryColorHex="#74CB48" />);
    expect(screen.getByText('overgrow')).toBeInTheDocument();
    expect(screen.getByText('chlorophyll')).toBeInTheDocument();
  });

  it('should display Moves label', () => {
    renderWithProviders(<AboutSection pokemon={mockPokemon} primaryColorHex="#74CB48" />);
    expect(screen.getByText('Moves')).toBeInTheDocument();
  });

  it('should handle pokemon with single ability', () => {
    const singleAbilityPokemon: PokemonDetail = {
      ...mockPokemon,
      abilities: [{ name: 'torrent' }],
    };
    renderWithProviders(<AboutSection pokemon={singleAbilityPokemon} primaryColorHex="#6493EB" />);
    expect(screen.getByText('torrent')).toBeInTheDocument();
    expect(screen.queryByText('chlorophyll')).not.toBeInTheDocument();
  });

  it('should format weight and height with correct decimals', () => {
    const pokemon: PokemonDetail = {
      ...mockPokemon,
      weight: 100,
      height: 20,
    };
    renderWithProviders(<AboutSection pokemon={pokemon} primaryColorHex="#74CB48" />);
    expect(screen.getByText('10.0 kg')).toBeInTheDocument();
    expect(screen.getByText('2.0 m')).toBeInTheDocument();
  });
});
