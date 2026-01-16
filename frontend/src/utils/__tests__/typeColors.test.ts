import { describe, it, expect } from 'vitest';
import { getTypeColorClass, getTypeColorHex } from '../typeColors';

describe('typeColors utilities', () => {
  describe('getTypeColorClass', () => {
    it('should return correct Tailwind class for valid type', () => {
      expect(getTypeColorClass('fire')).toBe('bg-type-fire');
      expect(getTypeColorClass('water')).toBe('bg-type-water');
      expect(getTypeColorClass('electric')).toBe('bg-type-electric');
    });

    it('should be case-insensitive', () => {
      expect(getTypeColorClass('FIRE')).toBe('bg-type-fire');
      expect(getTypeColorClass('Fire')).toBe('bg-type-fire');
      expect(getTypeColorClass('FiRe')).toBe('bg-type-fire');
    });

    it('should return default class for invalid type', () => {
      expect(getTypeColorClass('invalid')).toBe('bg-type-normal');
      expect(getTypeColorClass('unknown')).toBe('bg-type-normal');
    });

    it('should handle all defined types', () => {
      const types = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice',
        'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
        'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
      ];

      types.forEach(type => {
        expect(getTypeColorClass(type)).toBe(`bg-type-${type}`);
      });
    });
  });

  describe('getTypeColorHex', () => {
    it('should return correct hex color for valid type', () => {
      expect(getTypeColorHex('fire')).toBe('#F57D31');
      expect(getTypeColorHex('water')).toBe('#6493EB');
      expect(getTypeColorHex('electric')).toBe('#F9CF30');
    });

    it('should be case-insensitive', () => {
      expect(getTypeColorHex('FIRE')).toBe('#F57D31');
      expect(getTypeColorHex('Fire')).toBe('#F57D31');
    });

    it('should return normal color for invalid type', () => {
      expect(getTypeColorHex('invalid')).toBe('#AAA67F');
      expect(getTypeColorHex('unknown')).toBe('#AAA67F');
    });
  });
});
