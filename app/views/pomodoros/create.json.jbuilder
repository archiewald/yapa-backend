json.data do
  json.pomodoro do
    json.partial! 'pomodoros/pomodoro', pomodoro: @pomodoro
  end
end
