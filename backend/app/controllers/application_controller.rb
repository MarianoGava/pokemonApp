class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::Cookies
  
  # Enable session support
  before_action :set_session_store
  
  private
  
  def set_session_store
    request.session_options[:expire_after] = 1.hour
  end
end

