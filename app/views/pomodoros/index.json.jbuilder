json.data do
  json.array! @pomodoros do |pomodoro|
    json.partial! 'pomodoros/pomodoro', pomodoro: pomodoro
  end
end
