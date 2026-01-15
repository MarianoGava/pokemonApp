Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?
  config.active_support.deprecation = :notify
  config.log_level = :info
  config.log_formatter = ::Logger::Formatter.new
end

