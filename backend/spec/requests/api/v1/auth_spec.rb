require 'rails_helper'

RSpec.describe 'Api::V1::Auth', type: :request do
  describe 'POST /api/v1/login' do
    context 'with valid credentials' do
      it 'logs in successfully' do
        post '/api/v1/login', params: { username: 'admin', password: 'admin' }

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Login successful')
        expect(json_response['user']['username']).to eq('admin')
        expect(session[:user_id]).to eq('admin')
      end

    end

    context 'with invalid credentials' do
      it 'rejects wrong password' do
        post '/api/v1/login', params: { username: 'admin', password: 'wrong' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['error']).to eq('Invalid credentials')
        expect(session[:user_id]).to be_nil
      end

      it 'rejects wrong username' do
        post '/api/v1/login', params: { username: 'wrong', password: 'admin' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(session[:user_id]).to be_nil
      end

      it 'rejects both wrong username and password' do
        post '/api/v1/login', params: { username: 'wrong', password: 'wrong' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(session[:user_id]).to be_nil
      end

      it 'requires username parameter' do
        post '/api/v1/login', params: { password: 'admin' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
      end

      it 'requires password parameter' do
        post '/api/v1/login', params: { username: 'admin' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
      end

      it 'handles empty parameters' do
        post '/api/v1/login', params: { username: '', password: '' }

        expect(response).to have_http_status(:unauthorized)
        expect(session[:user_id]).to be_nil
      end

      it 'is case sensitive for username' do
        post '/api/v1/login', params: { username: 'Admin', password: 'admin' }

        expect(response).to have_http_status(:unauthorized)
        expect(session[:user_id]).to be_nil
      end

      it 'is case sensitive for password' do
        post '/api/v1/login', params: { username: 'admin', password: 'Admin' }

        expect(response).to have_http_status(:unauthorized)
        expect(session[:user_id]).to be_nil
      end
    end
  end

  describe 'POST /api/v1/logout' do
    context 'when logged in' do
      before do
        post '/api/v1/login', params: { username: 'admin', password: 'admin' }
      end

      it 'logs out successfully' do
        post '/api/v1/logout'

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Logged out successfully')
        expect(session[:user_id]).to be_nil
      end

    end

    context 'when not logged in' do
      it 'still returns success' do
        post '/api/v1/logout'

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
      end

      it 'does not raise error if session is already cleared' do
        post '/api/v1/logout'
        post '/api/v1/logout'

        expect(response).to have_http_status(:success)
      end
    end
  end

  describe 'session expiration' do
    let(:graphql_url) { 'https://beta.pokeapi.co/graphql/v1beta' }
    let(:graphql_response) do
      {
        data: {
          pokemon_v2_pokemon: [
            { id: 1, name: 'bulbasaur' }
          ]
        }
      }.to_json
    end

    it 'maintains session after login' do
      post '/api/v1/login', params: { username: 'admin', password: 'admin' }
      expect(session[:user_id]).to eq('admin')

      stub_request(:post, graphql_url)
        .to_return(status: 200, body: graphql_response, headers: { 'Content-Type' => 'application/json' })

      get '/api/v1/pokemons', params: { offset: 0, limit: 20 }
      
      expect(response.status).not_to eq(401)
      expect(response.status).to eq(200)
    end
  end
end
