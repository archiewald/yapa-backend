FactoryBot.define do
  factory :pomodoro do
    user
    name { 'Do your homework' }
    duration { 20 * 60 * 1000 } # 20 minutes
    started_at { DateTime.new(2019, 9, 1) }
  end
end
