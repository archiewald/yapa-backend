Rails.application.routes.draw do
  # not sure why below line is mandatory
  devise_for :users, skip: %i[sessions registrations passwords]
  resource :sessions, only: %i[create destroy show]

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :pomodoros
end
