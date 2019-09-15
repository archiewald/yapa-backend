# https://github.com/plataformatec/devise/blob/master/app/controllers/devise/confirmations_controller.rb

class ConfirmationsController < Devise::ConfirmationsController
  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    yield resource if block_given?

    if resource.errors.empty?
      head(:ok)
    else
      render(json: resource.errors, status: :unprocessable_entity)
    end
  end
end
