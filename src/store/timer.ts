import { StoreonModule } from "storeon";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const POMODORO_MS = 20 * 60 * 1000;

export interface TimerState {
  timer: {
    interval?: NodeJS.Timeout;
    endTime?: Date;
    pauseTimeCounter?: number;
    counter: number;
    mode?: TimerMode;
  };
}

export interface TimerEvents {
  start: undefined;
  pause: undefined;
  reset: undefined;
  update: undefined;
  setMode: TimerMode;
}

export const TimerModule: StoreonModule<TimerState, TimerEvents> = store => {
  store.on("@init", () => ({
    timer: {
      counter: POMODORO_MS
    }
  }));

  store.on("update", ({ timer }) => {
    const { endTime } = timer;
    const counter = differenceInMilliseconds(endTime!, new Date());

    return {
      timer: {
        ...timer,
        counter
      }
    };
  });

  store.on("start", ({ timer }) => {
    if (timer.interval) return { timer };

    const endTime = addMilliseconds(
      new Date(),
      timer.pauseTimeCounter || POMODORO_MS
    );

    const interval = setInterval(() => {
      store.dispatch("update");
    }, 1000);

    return {
      timer: {
        ...timer,
        interval,
        endTime
      }
    };
  });

  store.on("pause", ({ timer }) => {
    const { counter, interval } = timer;
    if (!interval) return { timer };

    const pauseTimeCounter = counter;

    clearInterval(interval);

    return {
      timer: {
        ...timer,
        interval: undefined,
        pauseTimeCounter
      }
    };
  });

  store.on("reset", ({ timer }) => {
    const { interval } = timer;

    if (interval) {
      clearInterval(interval);
    }

    return {
      timer: {
        counter: POMODORO_MS
      }
    };
  });
};
