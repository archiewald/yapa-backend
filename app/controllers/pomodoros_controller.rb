class PomodorosController < ApplicationController
  def index
    @pomodoros = Pomodoro.all
    render(:index, status: :ok)
  end

  def create
    @pomodoro = Pomodoro.new(pomodoro_params)
    @pomodoro.save
    render(:create, status: :created)
  end

  def destroy
    @pomodoro = Pomodoro.where(id: params[:id]).first
    if @contact.destroy
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
