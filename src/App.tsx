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

  const eventFilter = state.showRedactedEvents
    ? (_event: Event) => true
    : (event: Event) => !event.redacted;
  const sortedEventsRecentFirst = state.events
    .filter(eventFilter)
    .sort((a, b) => b.time - a.time);

  function logEvent(eventName: string) {
    const newEvent: Event = {
      name: eventName,
      time: Date.now(),
      redacted: false,
    };
    setState((state) => ({
      ...state,
      events: [...state.events, newEvent],
    }));
  }

  function redactEvent(eventTime: number) {
    setState((state) => ({
      ...state,
      events: state.events.map((event) =>
        event.time === eventTime ? { ...event, redacted: true } : event
      ),
    }));
  }

  function restoreEvent(eventTime: number) {
    setState((state) => ({
      ...state,
      events: state.events.map((event) =>
        event.time === eventTime ? { ...event, redacted: false } : event
      ),
    }));
  }

  function hideRedactedEvents() {
    setState((state) => ({
      ...state,
      showRedactedEvents: false,
    }));
  }

  function showRedactedEvents() {
    setState((state) => ({
      ...state,
      showRedactedEvents: true,
    }));
  }

  const toggleShowRedactedEventsButton = state.showRedactedEvents ? (
    <button onClick={hideRedactedEvents}>Hide redacted</button>
  ) : (
    <button onClick={showRedactedEvents}>Show redacted</button>
  );

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

      <h2>
        Events ({sortedEventsRecentFirst.length}){" "}
        {toggleShowRedactedEventsButton}
      </h2>
      <ul>
        {sortedEventsRecentFirst.map((event) => (
          <li
            key={event.time}
            className={"Event" + (event.redacted ? " Event--redacted" : "")}
          >
            {event.name} {<EventTime time={event.time} />}{" "}
            {event.redacted ? (
              <button onClick={() => restoreEvent(event.time)}>Restore</button>
            ) : (
              <button onClick={() => redactEvent(event.time)}>Redact</button>
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
    showRedactedEvents: false,
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
