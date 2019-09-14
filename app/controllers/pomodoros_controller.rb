class PomodorosController < ApplicationController
  def index
    @pomodoros = current_user.pomodoros
    render(:index, status: :ok)
  end

  def create
    @pomodoro = current_user.pomodoros.build(pomodoro_params)
    @pomodoro.save
    render(:create, status: :created)
  end

  def destroy
    @pomodoro = current_user.pomodoros.where(id: params[:id]).first
    if @pomodoro.destroy
      head(:ok)
    else
      head(:unprocessable_entity)
    end
  end

  private

  def pomodoro_params
    params.require(:pomodoro).permit(:name, :duration, :started_at)
  end
end
