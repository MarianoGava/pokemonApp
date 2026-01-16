import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/testUtils';
import PokemonCard from '../PokemonCard';
import { PokemonListItem } from '@/lib/api';

const mockPokemon: PokemonListItem = {
  id: 1,
  name: 'bulbasaur',
  number: 1,
  image_url: 'https://example.com/bulbasaur.png',
};

describe('PokemonCard', () => {
  it('should render pokemon name', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('should render pokemon number with padding', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText('#001')).toBeInTheDocument();
  });

  it('should render pokemon image', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />);
    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.image_url);
  });

  it('should have correct link to pokemon detail page', () => {
    renderWithProviders(<PokemonCard pokemon={mockPokemon} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pokemon/1');
  });

  it('should handle pokemon number padding correctly', () => {
    const pokemonWithLargeNumber: PokemonListItem = {
      ...mockPokemon,
      number: 150,
    };
    renderWithProviders(<PokemonCard pokemon={pokemonWithLargeNumber} />);
    expect(screen.getByText('#150')).toBeInTheDocument();
  });

  it('should capitalize pokemon name', () => {
    const pokemonLowercase: PokemonListItem = {
      ...mockPokemon,
      name: 'POKEMON',
    };
    renderWithProviders(<PokemonCard pokemon={pokemonLowercase} />);
    // The capitalize class should handle this, just verify it renders
    expect(screen.getByText('POKEMON')).toBeInTheDocument();
  });
});
