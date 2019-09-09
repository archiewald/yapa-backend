class CreatePomodoros < ActiveRecord::Migration[5.2]
  def change
    create_table :pomodoros do |t|
      t.string :name
      t.integer :duration
      t.datetime :started_at
      t.timestamps
    end
  end
end
