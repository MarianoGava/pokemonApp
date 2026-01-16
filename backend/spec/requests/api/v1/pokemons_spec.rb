require 'rails_helper'

RSpec.describe 'Api::V1::Pokemons', type: :request do
  let(:graphql_url) { 'https://beta.pokeapi.co/graphql/v1beta' }
  let(:base_url) { 'https://pokeapi.co/api/v2' }

  before do
    post '/api/v1/login', params: { username: 'admin', password: 'admin' }
  end

  describe 'GET /api/v1/pokemons' do
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
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 20 }

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('count')
      expect(json_response).to have_key('results')
      expect(json_response['results']).to be_an(Array)
      expect(json_response['results'].first).to have_key('id')
      expect(json_response['results'].first).to have_key('name')
      expect(json_response['results'].first).to have_key('image_url')
    end

    it 'respects pagination parameters' do
      stub_request(:post, graphql_url)
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 20, limit: 10 }

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('results')
    end

    it 'handles default pagination when params are missing' do
      stub_request(:post, graphql_url)
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons'

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('results')
    end

    it 'validates offset parameter (negative becomes 0)' do
      stub_request(:post, graphql_url)
        .with(body: ->(body) { JSON.parse(body)['query'].include?('offset: 0') })
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: -10, limit: 20 }

      expect(response).to have_http_status(:success)
    end

    it 'validates limit parameter (minimum 1)' do
      stub_request(:post, graphql_url)
        .with(body: ->(body) { JSON.parse(body)['query'].include?('limit: 1') })
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 0 }

      expect(response).to have_http_status(:success)
    end

    it 'validates limit parameter (maximum 100)' do
      stub_request(:post, graphql_url)
        .with(body: ->(body) { JSON.parse(body)['query'].include?('limit: 100') })
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 200 }

      expect(response).to have_http_status(:success)
    end

    it 'handles search parameter' do
      stub_request(:post, graphql_url)
        .with(body: ->(body) { JSON.parse(body)['query'].match?(/pikachu/i) })
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 20, search: 'pikachu' }

      expect(response).to have_http_status(:success)
    end

    it 'handles sort_by parameter' do
      stub_request(:post, graphql_url)
        .with(body: ->(body) { JSON.parse(body)['query'].match?(/order_by.*name/i) })
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 20, sort_by: 'name' }

      expect(response).to have_http_status(:success)
    end

    it 'strips whitespace from search parameter' do
      stub_request(:post, graphql_url)
        .with(body: ->(body) { JSON.parse(body)['query'].match?(/pikachu/i) })
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 20, search: '  pikachu  ' }

      expect(response).to have_http_status(:success)
    end

    it 'handles empty search parameter' do
      stub_request(:post, graphql_url)
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 20, search: '' }

      expect(response).to have_http_status(:success)
    end

    it 'handles API errors gracefully' do
      error_response = { error: 'Failed to fetch pokemons from PokeAPI' }.to_json
      stub_request(:post, graphql_url)
        .to_return(status: 500, body: 'Internal Server Error')

      get '/api/v1/pokemons', params: { offset: 0, limit: 20 }

      expect(response).to have_http_status(:bad_gateway)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('error')
    end
  end

  describe 'GET /api/v1/pokemons/:id' do
    let(:pokemon_id) { 1 }
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

      get "/api/v1/pokemons/#{pokemon_id}"

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('id')
      expect(json_response).to have_key('name')
      expect(json_response).to have_key('number')
      expect(json_response).to have_key('image_url')
      expect(json_response).to have_key('height')
      expect(json_response).to have_key('weight')
      expect(json_response).to have_key('types')
      expect(json_response).to have_key('abilities')
      expect(json_response).to have_key('stats')
    end

    it 'handles invalid pokemon id' do
      stub_request(:get, "#{base_url}/pokemon/999999")
        .to_return(status: 404, body: 'Not Found')

      get '/api/v1/pokemons/999999'

      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('error')
    end

    it 'handles string IDs' do
      stub_request(:get, "#{base_url}/pokemon/1")
        .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons/1'

      expect(response).to have_http_status(:success)
    end

    it 'handles API errors gracefully' do
      stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
        .to_raise(StandardError.new('Network error'))

      get "/api/v1/pokemons/#{pokemon_id}"

      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key('error')
    end
  end
end

RSpec.describe 'Api::V1::Pokemons (without authentication)', type: :request do
  let(:graphql_url) { 'https://beta.pokeapi.co/graphql/v1beta' }
  let(:base_url) { 'https://pokeapi.co/api/v2' }

  describe 'GET /api/v1/pokemons' do
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

    it 'requires authentication' do
      stub_request(:post, graphql_url)
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons'

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['error']).to eq('Unauthorized')
    end
  end

  describe 'GET /api/v1/pokemons/:id' do
    let(:pokemon_id) { 1 }
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

    it 'requires authentication' do
      stub_request(:get, "#{base_url}/pokemon/#{pokemon_id}")
        .to_return(status: 200, body: pokemon_data.to_json, headers: { 'Content-Type' => 'application/json' })

      get "/api/v1/pokemons/#{pokemon_id}"

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['error']).to eq('Unauthorized')
    end
  end
end
