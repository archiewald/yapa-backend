import { Pomodoro } from "./Pomodoro";
import { MongoosePomodoro } from "./model";

export interface PomodoroSerialized extends Omit<Pomodoro, "userId"> {}

export function serializePomodoro(
  pomodoro: MongoosePomodoro
): PomodoroSerialized {
  return {
    id: pomodoro.id as string,
    startDate: pomodoro.startDate,
    duration: pomodoro.duration,
    tags: pomodoro.tags,
  };
}
