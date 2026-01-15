require 'rails_helper'

RSpec.describe PokeapiService do
  describe '.get_pokemons' do
    it 'returns paginated pokemons list' do
      VCR.use_cassette('pokeapi_pokemons_list') do
        result = described_class.get_pokemons(offset: 0, limit: 20)
        
        expect(result).to have_key(:count)
        expect(result).to have_key(:results)
        expect(result[:results]).to be_an(Array)
        expect(result[:results].first).to have_key(:id)
        expect(result[:results].first).to have_key(:name)
        expect(result[:results].first).to have_key(:image_url)
      end
    end

    it 'handles pagination correctly' do
      VCR.use_cassette('pokeapi_pokemons_pagination') do
        result = described_class.get_pokemons(offset: 20, limit: 20)
        
        expect(result[:results].length).to be <= 20
      end
    end

    it 'handles API errors gracefully' do
      allow(HTTParty).to receive(:get).and_raise(StandardError.new('Network error'))
      
      result = described_class.get_pokemons(offset: 0, limit: 20)
      
      expect(result).to have_key(:error)
    end
  end

  describe '.get_pokemon' do
    it 'returns pokemon details' do
      VCR.use_cassette('pokeapi_pokemon_detail') do
        result = described_class.get_pokemon(1)
        
        expect(result).to have_key(:id)
        expect(result).to have_key(:name)
        expect(result).to have_key(:types)
        expect(result).to have_key(:abilities)
        expect(result).to have_key(:moves)
        expect(result).to have_key(:forms)
        expect(result).to have_key(:stats)
      end
    end

    it 'handles invalid pokemon id' do
      VCR.use_cassette('pokeapi_pokemon_not_found') do
        result = described_class.get_pokemon(999999)
        
        expect(result).to have_key(:error)
      end
    end
  end
end
