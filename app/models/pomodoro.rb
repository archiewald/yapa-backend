class Pomodoro < ApplicationRecord
  validates :name, presence: true
  validates :duration, presence: true
  validates :started_at, presence: true
end
