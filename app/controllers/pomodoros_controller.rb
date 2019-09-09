class PomodorosController < ApplicationController
  def index
    @pomodoros = Pomodoro.all

    render(json: @pomodoros, status: :ok)
  end
end
