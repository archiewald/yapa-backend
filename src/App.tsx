import React from "react";
import { useStoreon } from "storeon/react";
import { AppState, AppEvents } from "./store";
import { renderTimeString } from "./utils/timeUtils";

export const App: React.FC = () => {
  const {
    timer: { counter },
    dispatch
  } = useStoreon<AppState, AppEvents>("timer");

  return (
    <div>
      <button
        onClick={() => {
          dispatch("timerSetMode", "pomodoro");
        }}
      >
        Pomodoro
      </button>
      <button
        onClick={() => {
          dispatch("timerSetMode", "shortBreak");
        }}
      >
        Short break
      </button>
      <button
        onClick={() => {
          dispatch("timerSetMode", "longBreak");
        }}
      >
        Long break
      </button>

      <h1>{renderTimeString(counter)}</h1>

      <button
        onClick={() => {
          dispatch("timerStart");
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          dispatch("timerPause");
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          dispatch("timerReset");
        }}
      >
        Reset
      </button>
    </div>
  );
};
