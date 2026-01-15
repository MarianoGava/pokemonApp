module Api
  module V1
    class PokemonsController < ApplicationController
      before_action :authenticate_user

      def index
        result = PokeapiService.get_pokemons(
          offset: params[:offset]&.to_i || 0,
          limit: params[:limit]&.to_i || 20,
          search: params[:search]&.strip,
          sort_by: params[:sort_by]&.strip
        )
        
        if result[:error]
          render json: { error: result[:error] }, status: :bad_gateway
        else
          render json: result
        end
      end

      def show
        result = PokeapiService.get_pokemon(params[:id])
        
        if result[:error]
          render json: { error: result[:error] }, status: :not_found
        else
          render json: result
        end
      end

      private

      def authenticate_user
        unless session[:user_id]
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
    end
  end
end

