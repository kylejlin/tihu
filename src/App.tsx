import React, { useState, useEffect } from "react";
import "./App.css";
import { Props, State, Event } from "./types";

function App({ stateProvider }: Props) {
  const [state, setState] = useState(
    stateProvider.getSavedState() ?? getDefaultState()
  );

  useEffect(() => {
    stateProvider.saveState(state);
  });

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
