import { StoreonModule } from "storeon";

export interface ClockState {
  counter: number;
}

export interface ClockEvents {
  start: undefined;
  up: undefined;
}

export const clockModule: StoreonModule<ClockState, ClockEvents> = store => {
  store.on("@init", () => ({
    counter: 0
  }));
  store.on("up", state => ({
    ...state,
    counter: state.counter + 1
  }));
  store.on("start", () => {
    setInterval(() => {
      store.dispatch("up");
    }, 1000);
  });
};
