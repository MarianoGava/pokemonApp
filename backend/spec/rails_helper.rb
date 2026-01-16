require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)

abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

if defined?(ActiveRecord)
  begin
    ActiveRecord::Migration.maintain_test_schema!
  rescue ActiveRecord::NoDatabaseError
  end
end

RSpec.configure do |config|
  if defined?(ActiveRecord)
    config.fixture_path = "#{::Rails.root}/spec/fixtures"
    config.use_transactional_fixtures = true
  else
    config.use_active_record = false
  end

  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
