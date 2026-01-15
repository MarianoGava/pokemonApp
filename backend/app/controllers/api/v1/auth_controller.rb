module Api
  module V1
    class AuthController < ApplicationController
      def login
        username = params[:username]
        password = params[:password]

        if username == 'admin' && password == 'admin'
          session[:user_id] = username
          render json: { 
            success: true, 
            message: 'Login successful',
            user: { username: username }
          }
        else
          render json: { 
            success: false, 
            error: 'Invalid credentials' 
          }, status: :unauthorized
        end
      end

      def logout
        session.delete(:user_id)
        render json: { success: true, message: 'Logged out successfully' }
      end
    end
  end
end

