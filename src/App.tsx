import React, { useState } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState(getSavedState() ?? getDefaultState());
  const sortedEvents = state.events.slice().sort((a, b) => a.time - b.time);

  function logEvent(eventName: string) {
    const newEvent: Event = {
      name: eventName,
      time: Date.now(),
      deleted: false,
    };
    setState((state) => ({
      ...state,
      events: [...state.events, newEvent],
    }));
  }

  return (
    <div className="App">
      <h1>Tihu</h1>

      <h2>Log</h2>
      <ul>
        {state.loggableEventNames.map((loggableName) => (
          <li key={loggableName}>
            {loggableName}{" "}
            <button onClick={() => logEvent(loggableName)}>Log</button>
          </li>
        ))}
        <li>
          New: <input value="todo" readOnly />
        </li>
      </ul>

      <h2>Events ({sortedEvents.length})</h2>
      <ul>
        {sortedEvents.map((event) => (
          <li key={event.time}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

export interface State {
  readonly loggableEventNames: readonly string[];
  readonly events: readonly Event[];
}

export interface Event {
  readonly name: string;
  /** Number of milliseconds since the JS Date epoch. */
  readonly time: number;
  readonly deleted: boolean;
}

const LocalStorageKeys = {
  State: "tihu_state",
} as const;

function getSavedState(): null | State {
  const savedState = localStorage.getItem(LocalStorageKeys.State);
  if (savedState === null) {
    return null;
  }
  return JSON.parse(savedState);
}

function getDefaultState(): State {
  return {
    loggableEventNames: [
      "bed",
      "dental start",
      "dental end",
      "meal start",
      "meal end",
      "gym start",
      "gym end",
      "sleep",
    ],
    events: [],
  };
}
