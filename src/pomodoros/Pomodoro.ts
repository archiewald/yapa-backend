export interface Pomodoro {
  id: string;
  userId: string;
  startDate: string;
  duration: number;
  tags: Array<string>;
}
