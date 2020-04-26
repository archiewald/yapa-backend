export interface User {
  id: string;
  email: string;
  verified: boolean;
  password: string;
  settings: UserSettings;
}

export interface UserSettings {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}
