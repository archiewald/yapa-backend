class ApplicationController < ActionController::API
  # Security note: controllers with no-CSRF protection must disable the Devise fallback,
  # see https://github.com/gonzalo-bulnes/simple_token_authentication/issues/49
  acts_as_token_authentication_handler_for User, fallback: :none
end
