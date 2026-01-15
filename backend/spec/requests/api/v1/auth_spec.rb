require 'rails_helper'

RSpec.describe 'Api::V1::Auth', type: :request do
  describe 'POST /api/v1/login' do
    it 'logs in with valid credentials' do
      post '/api/v1/login', params: { username: 'admin', password: 'admin' }
      
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(json_response['user']['username']).to eq('admin')
      expect(session[:user_id]).to eq('admin')
    end

    it 'rejects invalid credentials' do
      post '/api/v1/login', params: { username: 'admin', password: 'wrong' }
      
      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be false
      expect(json_response['error']).to eq('Invalid credentials')
    end

    it 'requires username and password' do
      post '/api/v1/login', params: { username: 'admin' }
      
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /api/v1/logout' do
    it 'logs out successfully' do
      # First login
      post '/api/v1/login', params: { username: 'admin', password: 'admin' }
      
      # Then logout
      post '/api/v1/logout'
      
      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response['success']).to be true
      expect(session[:user_id]).to be_nil
    end
  end
end
