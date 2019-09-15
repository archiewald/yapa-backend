class SessionsController < ApplicationController
  def show
    current_user ? head(:ok) : head(:unauothorized)
  end

  def create
    @user = User.find_by(email: params[:email])
    if @user&.valid_password?(params[:password]) && @user&.confirmed_at
      render(:create, status: :created)
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
