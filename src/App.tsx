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

  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);

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

  function deleteEvent(eventTime: number) {
    setState((state) => ({
      ...state,
      events: state.events.map((event) =>
        event.time === eventTime ? { ...event, deleted: true } : event
      ),
    }));
  }

  function restoreEvent(eventTime: number) {
    setState((state) => ({
      ...state,
      events: state.events.map((event) =>
        event.time === eventTime ? { ...event, deleted: false } : event
      ),
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

      <h2>Events ({sortedEventsRecentFirst.length})</h2>
      <ul>
        {sortedEventsRecentFirst.map((event) => (
          <li key={event.time}>
            {event.name} {<EventTime time={event.time} />}{" "}
            {event.deleted ? (
              <button onClick={() => restoreEvent(event.time)}>Restore</button>
            ) : (
              <button onClick={() => deleteEvent(event.time)}>Delete</button>
            )}
          </li>
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

function EventTime({ time }: { time: number }) {
  const date = new Date(time);
  return (
    <span className="EventTime">
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
}
