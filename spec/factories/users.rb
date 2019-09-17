FactoryBot.define do
  # https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md#sequences
  sequence :email do |n|
    "user#{n}@example.com"
  end

  factory :user do
    email
    password { 'password' }
    password_confirmation { 'password' }
  end
end
