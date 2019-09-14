class AddUserIdToPomodoros < ActiveRecord::Migration[5.2]
  def change
    add_reference :pomodoros, :user, index: true, foreign_key: true
  end
end
