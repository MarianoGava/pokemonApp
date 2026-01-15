Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'login', to: 'auth#login'
      post 'logout', to: 'auth#logout'
      get 'pokemons', to: 'pokemons#index'
      get 'pokemons/:id', to: 'pokemons#show'
    end
  end
end

