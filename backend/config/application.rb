require_relative 'boot'

# Only require what we need for API-only app
require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
# require 'active_job/railtie'  # Not needed - no background jobs
# require 'active_record/railtie'  # Not needed - no database
# require 'active_storage/engine'  # Not needed - no file uploads
require 'action_controller/railtie'
# require 'action_mailer/railtie'  # Not needed - no emails
# require 'action_mailbox/engine'  # Not needed
# require 'action_text/engine'  # Not needed
require 'action_view/railtie'  # Needed for rendering JSON
# require 'action_cable/engine'  # Not needed - no websockets
# require 'rails/test_unit/railtie'

Bundler.require(*Rails.groups)

module PokemonApi
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    
    # Enable sessions for authentication
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: '_pokemon_app_session'
    
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins ENV.fetch('CORS_ORIGINS', 'http://localhost:3000')
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          credentials: true
      end
    end
  end
end

