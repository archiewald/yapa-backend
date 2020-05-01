export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface User {
  id: string;
  email: string;
  verified: boolean;
  password: string;
  settings: UserSettings;
}

export interface UserSettings {
  timer: { [Mode in TimerMode]: number };
}
