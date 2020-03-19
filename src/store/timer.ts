import { StoreonModule } from "storeon";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";

import { minutesToMs, msToFullMinutes } from "utils/timeUtils";
import { showNotification } from "notifications";
import { setBadge } from "badge";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const MODE_TIMES: { [Mode in TimerMode]: number } = {
  pomodoro: minutesToMs(40),
  shortBreak: minutesToMs(5),
  longBreak: minutesToMs(15)
};

export interface TimerState {
  timer: {
    interval?: NodeJS.Timeout;
    endTime?: Date;
    done: boolean;
    counter: number;
    mode: TimerMode;
  };
}

export interface TimerEvents {
  timerStart: undefined;
  timerPause: undefined;
  timerReset: undefined;
  timerUpdate: undefined;
  timerSetMode: TimerMode;
}

export const TimerModule: StoreonModule<TimerState, TimerEvents> = store => {
  store.on("@init", () => ({
    timer: {
      mode: "pomodoro",
      counter: MODE_TIMES.pomodoro,
      done: false
    }
  }));

  store.on("timerUpdate", ({ timer }) => {
    const { endTime, mode } = timer;
    const counter = differenceInMilliseconds(endTime!, new Date());
    const done = counter <= 0;

    setBadge(msToFullMinutes(counter));

    if (done) {
      notifyTimerFinished(mode);
      return store.dispatch("timerReset");
    }

    return {
      timer: {
        ...timer,
        done,
        counter
      }
    };
  });

  store.on("timerStart", ({ timer }) => {
    if (timer.interval) return { timer };

    const endTime = addMilliseconds(
      new Date(),
      timer.counter || MODE_TIMES[timer.mode]
    );

    const interval = setInterval(() => {
      store.dispatch("timerUpdate");
    }, 1000);

    return {
      timer: {
        ...timer,
        interval,
        endTime
      }
    };
  });

  store.on("timerPause", ({ timer }) => {
    const { interval } = timer;
    if (!interval) return { timer };

    clearInterval(interval);

    return {
      timer: {
        ...timer,
        interval: undefined
      }
    };
  });

  store.on("timerReset", ({ timer }) => {
    const { interval } = timer;

    if (interval) {
      clearInterval(interval);
    }

    return {
      timer: {
        ...timer,
        counter: MODE_TIMES[timer.mode],
        interval: undefined
      }
    };
  });

  store.on("timerSetMode", ({ timer }, mode) => {
    const { interval } = timer;

    if (interval) {
      clearInterval(interval);
    }

    return {
      timer: {
        ...timer,
        mode,
        counter: MODE_TIMES[mode],
        interval: undefined
      }
    };
  });
};

async function notifyTimerFinished(mode: TimerMode) {
  switch (mode) {
    case "pomodoro":
      await showNotification("Pomodoro finished!");
      return;
    case "shortBreak":
      await showNotification("Short break finished!");
      return;
    case "longBreak":
      await showNotification("Long break finished!");
      return;
  }
}
