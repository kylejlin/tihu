import React, { useState, useEffect } from "react";
import "./App.css";
import { Props, State, Event, StateHookProps } from "./types";

function App({ stateProvider }: Props) {
  const stateHook = useState(
    stateProvider.getSavedState() ?? getDefaultState()
  );
  const [state, setState] = stateHook;

  useEffect(() => {
    stateProvider.saveState(state);
  });

  const eventFilter = state.showRedactedEvents
    ? (_event: Event) => true
    : (event: Event) => !event.redacted;
  const sortedEventsRecentFirst = state.events
    .filter(eventFilter)
    .sort((a, b) => b.time - a.time);

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

      <LoggableMenu stateHook={stateHook} />

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
    isEditingLoggableEventNames: false,
    tentativeNewLoggableEventName: "",

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

function LoggableMenu({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;

  function startEditingLoggables() {
    setState((state) => ({
      ...state,
      isEditingLoggableEventNames: true,
    }));
  }

  function stopEditingLoggables() {
    setState((state) => ({
      ...state,
      isEditingLoggableEventNames: false,
    }));
  }

  function setTentativeNewLoggableName(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setState((state) => ({
      ...state,
      tentativeNewLoggableEventName: event.target.value,
    }));
  }

  function addTentativeNewLoggable() {
    setState((state) => ({
      ...state,
      loggableEventNames: state.loggableEventNames.some(
        (eventName) => eventName === state.tentativeNewLoggableEventName
      )
        ? state.loggableEventNames
        : state.loggableEventNames.concat([
            state.tentativeNewLoggableEventName,
          ]),
    }));
  }

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

  const toggleIsEditingLoggablesButton = state.isEditingLoggableEventNames ? (
    <button onClick={stopEditingLoggables}>Stop editing</button>
  ) : (
    <button onClick={startEditingLoggables}>Edit loggables</button>
  );

  return (
    <>
      <h2>Log {toggleIsEditingLoggablesButton}</h2>
      <ul>
        {state.loggableEventNames.map((loggableName) => (
          <li key={loggableName}>
            {loggableName}{" "}
            <button onClick={() => logEvent(loggableName)}>Log</button>
          </li>
        ))}
        {state.isEditingLoggableEventNames && (
          <li>
            New:{" "}
            <input
              value={state.tentativeNewLoggableEventName}
              onChange={setTentativeNewLoggableName}
            />{" "}
            <button onClick={addTentativeNewLoggable}>Add</button>
          </li>
        )}
      </ul>
    </>
  );
}
