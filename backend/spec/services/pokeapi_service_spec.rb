require 'rails_helper'

RSpec.describe PokeapiService do
  describe '.get_pokemons' do
    let(:graphql_url) { 'https://beta.pokeapi.co/graphql/v1beta' }
    
    context 'with successful response' do
      let(:graphql_response) do
        {
          data: {
            pokemon_v2_pokemon: [
              { id: 1, name: 'bulbasaur' },
              { id: 2, name: 'ivysaur' }
            ]
          }
        }.to_json
      end

      it 'returns paginated pokemons list' do
        stub_request(:post, graphql_url)
          .with(
            body: ->(body) { JSON.parse(body)['query'].include?('pokemon_v2_pokemon') },
            headers: { 'Content-Type' => 'application/json' }
          )
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result).to have_key(:count)
        expect(result).to have_key(:results)
        expect(result[:results]).to be_an(Array)
        expect(result[:results].first).to have_key(:id)
        expect(result[:results].first).to have_key(:name)
        expect(result[:results].first).to have_key(:image_url)
      end

      it 'handles pagination correctly' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { JSON.parse(body)['query'].include?('offset: 20') })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 20, limit: 20)

        expect(result[:results]).to be_an(Array)
        expect(result).to have_key(:next)
        expect(result).to have_key(:previous)
      end

      it 'handles search by name' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { JSON.parse(body)['query'].match?(/name.*_ilike.*pikachu/i) })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20, search: 'pikachu')

        expect(result).to have_key(:results)
      end

      it 'handles search by ID' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { JSON.parse(body)['query'].include?('id') && JSON.parse(body)['query'].include?('_eq: 25') })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20, search: '25')

        expect(result).to have_key(:results)
      end

      it 'handles sort_by name' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { JSON.parse(body)['query'].match?(/order_by.*name.*asc/) })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20, sort_by: 'name')

        expect(result).to have_key(:results)
      end

      it 'handles sort_by id' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { JSON.parse(body)['query'].match?(/order_by.*id.*asc/) })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20, sort_by: 'id')

        expect(result).to have_key(:results)
      end

      it 'defaults to id sort when sort_by is nil' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { JSON.parse(body)['query'].match?(/order_by.*id.*asc/) })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result).to have_key(:results)
      end

      it 'handles empty search string' do
        stub_request(:post, graphql_url)
          .with(body: ->(body) { !JSON.parse(body)['query'].include?('where:') })
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20, search: '')

        expect(result).to have_key(:results)
      end

      it 'includes previous link when offset > 0' do
        stub_request(:post, graphql_url)
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 20, limit: 20)

        expect(result[:previous]).not_to be_nil
      end

      it 'does not include previous link when offset is 0' do
        stub_request(:post, graphql_url)
          .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result[:previous]).to be_nil
      end
    end

    context 'with GraphQL errors' do
      let(:error_response) do
        {
          errors: [{ message: 'GraphQL query error' }]
        }.to_json
      end

      it 'handles GraphQL errors gracefully' do
        stub_request(:post, graphql_url)
          .to_return(status: 200, body: error_response, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result).to have_key(:error)
        expect(result[:error]).to eq('GraphQL query error')
      end
    end

    context 'with HTTP errors' do
      it 'handles HTTP 500 errors' do
        stub_request(:post, graphql_url)
          .to_return(status: 500, body: 'Internal Server Error')

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result).to have_key(:error)
      end

      it 'handles network errors' do
        stub_request(:post, graphql_url)
          .to_raise(StandardError.new('Network error'))

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result).to have_key(:error)
        expect(result[:error]).to eq('Network error')
      end

      it 'handles timeout errors' do
        stub_request(:post, graphql_url)
          .to_timeout

        result = described_class.get_pokemons(offset: 0, limit: 20)

        expect(result).to have_key(:error)
      end
    end
  end

  describe '.get_pokemon' do
    let(:base_url) { 'https://pokeapi.co/api/v2' }
    let(:pokemon_id) { 1 }

    context 'with successful response' do
      let(:pokemon_data) do
        {
          id: pokemon_id,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          types: [
            { type: { name: 'grass' } },
            { type: { name: 'poison' } }
          ],
          abilities: [
            { ability: { name: 'overgrow' } }
          ],
          stats: [
            { stat: { name: 'hp' }, base_stat: 45 }
          ]
        }
      end

      it 'returns pokemon details' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemon(pokemon_id)

        expect(result).to have_key(:id)
        expect(result).to have_key(:name)
        expect(result).to have_key(:number)
        expect(result).to have_key(:image_url)
        expect(result).to have_key(:height)
        expect(result).to have_key(:weight)
        expect(result).to have_key(:types)
        expect(result).to have_key(:abilities)
        expect(result).to have_key(:stats)
      end

      it 'transforms types correctly' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemon(pokemon_id)

        expect(result[:types]).to eq(['grass', 'poison'])
      end

      it 'transforms abilities correctly' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemon(pokemon_id)

        expect(result[:abilities]).to be_an(Array)
        expect(result[:abilities].first).to have_key(:name)
        expect(result[:abilities].first[:name]).to eq('overgrow')
      end

      it 'transforms stats correctly' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemon(pokemon_id)

        expect(result[:stats]).to be_an(Array)
        expect(result[:stats].first).to have_key(:name)
        expect(result[:stats].first).to have_key(:base_stat)
      end

      it 'generates correct image URL' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemon(pokemon_id)

        expected_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/#{pokemon_id}.png"
        expect(result[:image_url]).to eq(expected_url)
      end
    end

    context 'with errors' do
      it 'handles 404 errors' do
        stub_request(:get, "#{base_url}/pokemon/999999")
          .to_return(status: 404, body: 'Not Found')

        result = described_class.get_pokemon(999999)

        expect(result).to have_key(:error)
        expect(result[:error]).to eq('Pokemon not found')
      end

      it 'handles network errors' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_raise(StandardError.new('Connection error'))

        result = described_class.get_pokemon(pokemon_id)

        expect(result).to have_key(:error)
        expect(result[:error]).to eq('Connection error')
      end

      it 'handles invalid JSON responses' do
        stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
          .to_return(status: 200, body: 'invalid json', headers: { 'Content-Type' => 'application/json' })

        result = described_class.get_pokemon(pokemon_id)
        expect(result).to have_key(:error)
      end
    end
  end

  describe '.build_graphql_query' do
    it 'builds query with default parameters' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: nil, sort_by: nil)

      expect(query).to include('limit: 20')
      expect(query).to include('offset: 0')
      expect(query).to include('order_by: { id: asc }')
      expect(query).not_to include('where:')
    end

    it 'builds query with search by name' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: 'pikachu', sort_by: nil)

      expect(query).to include('where:')
      expect(query).to include('name')
      expect(query).to include('_ilike')
    end

    it 'builds query with search by ID' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: '25', sort_by: nil)

      expect(query).to include('where:')
      expect(query).to include('id')
      expect(query).to include('_eq: 25')
    end

    it 'builds query with sort_by name' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: nil, sort_by: 'name')

      expect(query).to include('order_by: { name: asc }')
    end

    it 'builds query with sort_by id' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: nil, sort_by: 'id')

      expect(query).to include('order_by: { id: asc }')
    end

    it 'escapes quotes in search string' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: 'poke"mon', sort_by: nil)

      expect(query).to include('\\"')
      expect(query).not_to include('poke"mon')
    end

    it 'handles empty search string' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: '', sort_by: nil)

      expect(query).not_to include('where:')
    end

    it 'handles whitespace-only search string' do
      query = described_class.send(:build_graphql_query, offset: 0, limit: 20, search: '   ', sort_by: nil)

      expect(query).not_to include('where:')
    end
  end
end
