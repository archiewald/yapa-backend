import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useStoreon } from "storeon/react";
import { AppState, AppEvents } from "./store/store";

function App() {
  const { counter, dispatch } = useStoreon<AppState, AppEvents>("counter");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{counter}</p>
        <button
          onClick={() => {
            dispatch("start");
          }}
        >
          Start counter
        </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
