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
      <h1>{renderTimeString(counter)}</h1>
      <button
        onClick={() => {
          dispatch("start");
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          dispatch("pause");
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          dispatch("reset");
        }}
      >
        Reset
      </button>
    </div>
  );
};
