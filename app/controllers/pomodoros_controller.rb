class PomodorosController < ApplicationController
  def index
    @pomodoros = Pomodoro.all
    render(json: @pomodoros, status: :ok)
  end

  def create
    @pomodoro = Pomodoro.new(pomodoro_params)
    @pomodoro.save
    render(json: @pomodoro, status: :created)
  end

  private

  def pomodoro_params
    params.require(:pomodoro).permit(:name, :duration, :started_at)
  end
end
