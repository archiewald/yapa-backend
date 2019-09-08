class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      render(json: user.as_json(only: %i[email authentication_token]), status: :created)
    else
      head(:unauthorized)
    end
  end

  def destroy
    return head(:unauthorized) unless current_user

    current_user.authentication_token = nil
    current_user.save
    head(:ok)
  end
end
