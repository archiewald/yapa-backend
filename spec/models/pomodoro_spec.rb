require 'rails_helper'

RSpec.describe Pomodoro, type: :model do
  before(:all) do
    @pomodoro = create(:pomodoro)
  end

  it 'is valid with valid attributes' do
    expect(@pomodoro).to be_valid
  end

  it 'is not valid with no user' do
    @pomodoro.user = nil
    expect(@pomodoro).to be_invalid
  end
end
