require 'rails_helper'

RSpec.describe 'Api::V1::Pokemons', type: :request do
  before do
    # Login before each test
    post '/api/v1/login', params: { username: 'admin', password: 'admin' }
  end

  describe 'GET /api/v1/pokemons' do
    it 'returns paginated pokemons list' do
      VCR.use_cassette('pokeapi_pokemons_list') do
        get '/api/v1/pokemons', params: { offset: 0, limit: 20 }
        
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('count')
        expect(json_response).to have_key('results')
        expect(json_response['results']).to be_an(Array)
      end
    end

    it 'respects pagination parameters' do
      VCR.use_cassette('pokeapi_pokemons_pagination') do
        get '/api/v1/pokemons', params: { offset: 20, limit: 10 }
        
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['results'].length).to be <= 10
      end
    end

    it 'requires authentication' do
      # Clear session
      delete '/api/v1/logout'
      
      get '/api/v1/pokemons'
      
      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['error']).to eq('Unauthorized')
    end
  end

  describe 'GET /api/v1/pokemons/:id' do
    it 'returns pokemon details' do
      VCR.use_cassette('pokeapi_pokemon_detail') do
        get '/api/v1/pokemons/1'
        
        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('id')
        expect(json_response).to have_key('name')
        expect(json_response).to have_key('abilities')
        expect(json_response).to have_key('moves')
        expect(json_response).to have_key('forms')
      end
    end

    it 'handles invalid pokemon id' do
      VCR.use_cassette('pokeapi_pokemon_not_found') do
        get '/api/v1/pokemons/999999'
        
        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('error')
      end
    end

    it 'requires authentication' do
      delete '/api/v1/logout'
      
      get '/api/v1/pokemons/1'
      
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
