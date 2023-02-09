import React, { useState, useEffect, ReactNode } from "react";
import "./App.css";
import { Props, State, Event, StateHookProps, MenuKind } from "./types";

function App({ stateProvider }: Props) {
  const stateHook = useState(
    stateProvider.getSavedState() ?? getDefaultState()
  );
  const [state] = stateHook;

  useEffect(() => {
    stateProvider.saveState(state);
  });

  const activeMenu = ((): ReactNode => {
    switch (state.menuKind) {
      case MenuKind.Home:
        return <HomeMenu stateHook={stateHook} />;
      case MenuKind.Stamps:
        return <StampsMenu stateHook={stateHook} />;
      case MenuKind.Events:
        return <EventsMenu stateHook={stateHook} />;
    }
  })();

  return (
    <div className="App">
      {activeMenu}

      <NavBar stateHook={stateHook} />
    </div>
  );
}

export default App;

function getDefaultState(): State {
  return {
    menuKind: MenuKind.Home,

    stamps: ["🛏️", "🏋️", "🦷", "🍛", "📝", "🎏", "🏖️"],

    events: [],
    showRedactedEvents: false,
  };
}

// function EventTime({ time }: { time: number }) {
//   const date = new Date(time);
//   return (
//     <span className="EventTime">
//       {date.toLocaleDateString()} {date.toLocaleTimeString()}
//     </span>
//   );
// }

// function LoggableMenu({ stateHook }: StateHookProps) {
//   const [state, setState] = stateHook;

//   function startEditingLoggables() {
//     setState((state) => ({
//       ...state,
//       isEditingLoggableEventNames: true,
//     }));
//   }

//   function stopEditingLoggables() {
//     setState((state) => ({
//       ...state,
//       isEditingLoggableEventNames: false,
//     }));
//   }

//   function setTentativeNewLoggableName(
//     event: React.ChangeEvent<HTMLInputElement>
//   ) {
//     setState((state) => ({
//       ...state,
//       tentativeNewLoggableEventName: event.target.value,
//     }));
//   }

//   function addTentativeNewLoggable() {
//     setState((state) => ({
//       ...state,
//       loggableEventNames: state.loggableEventNames.some(
//         (eventName) => eventName === state.tentativeNewLoggableEventName
//       )
//         ? state.loggableEventNames
//         : state.loggableEventNames.concat([
//             state.tentativeNewLoggableEventName,
//           ]),
//     }));
//   }

//   function logEvent(eventName: string) {
//     const newEvent: Event = {
//       name: eventName,
//       time: Date.now(),
//       redacted: false,
//     };
//     setState((state) => ({
//       ...state,
//       events: [...state.events, newEvent],
//     }));
//   }

//   const toggleIsEditingLoggablesButton = state.isEditingLoggableEventNames ? (
//     <button onClick={stopEditingLoggables}>Stop editing</button>
//   ) : (
//     <button onClick={startEditingLoggables}>Edit loggables</button>
//   );

//   return (
//     <>
//       <h2>Log {toggleIsEditingLoggablesButton}</h2>
//       <ul>
//         {state.loggableEventNames.map((loggableName) => (
//           <li key={loggableName}>
//             {loggableName}{" "}
//             <button onClick={() => logEvent(loggableName)}>Log</button>
//           </li>
//         ))}
//         {state.isEditingLoggableEventNames && (
//           <li>
//             New:{" "}
//             <input
//               value={state.tentativeNewLoggableEventName}
//               onChange={setTentativeNewLoggableName}
//             />{" "}
//             <button onClick={addTentativeNewLoggable}>Add</button>
//           </li>
//         )}
//       </ul>
//     </>
//   );
// }

// function EventsMenu({ stateHook }: StateHookProps) {
//   const [state, setState] = stateHook;

//   const eventFilter = state.showRedactedEvents
//     ? (_event: Event) => true
//     : (event: Event) => !event.redacted;
//   const sortedEventsRecentFirst = state.events
//     .filter(eventFilter)
//     .sort((a, b) => b.time - a.time);

//   function redactEvent(eventTime: number) {
//     setState((state) => ({
//       ...state,
//       events: state.events.map((event) =>
//         event.time === eventTime ? { ...event, redacted: true } : event
//       ),
//     }));
//   }

//   function restoreEvent(eventTime: number) {
//     setState((state) => ({
//       ...state,
//       events: state.events.map((event) =>
//         event.time === eventTime ? { ...event, redacted: false } : event
//       ),
//     }));
//   }

//   function hideRedactedEvents() {
//     setState((state) => ({
//       ...state,
//       showRedactedEvents: false,
//     }));
//   }

//   function showRedactedEvents() {
//     setState((state) => ({
//       ...state,
//       showRedactedEvents: true,
//     }));
//   }

//   const toggleShowRedactedEventsButton = state.showRedactedEvents ? (
//     <button onClick={hideRedactedEvents}>Hide redacted</button>
//   ) : (
//     <button onClick={showRedactedEvents}>Show redacted</button>
//   );

//   return (
//     <>
//       <h2>
//         Events ({sortedEventsRecentFirst.length}){" "}
//         {toggleShowRedactedEventsButton}
//       </h2>
//       <ul>
//         {sortedEventsRecentFirst.map((event) => (
//           <li
//             key={event.time}
//             className={"Event" + (event.redacted ? " Event--redacted" : "")}
//           >
//             {event.name} {<EventTime time={event.time} />}{" "}
//             {event.redacted ? (
//               <button onClick={() => restoreEvent(event.time)}>Restore</button>
//             ) : (
//               <button onClick={() => redactEvent(event.time)}>Redact</button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

function NavBar({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;

  function navigateToHomeMenu() {
    setState((state) => ({
      ...state,
      menuKind: MenuKind.Home,
    }));
  }

  function navigateToStampsMenu() {
    setState((state) => ({
      ...state,
      menuKind: MenuKind.Stamps,
    }));
  }

  function navigateToEventsMenu() {
    setState((state) => ({
      ...state,
      menuKind: MenuKind.Events,
    }));
  }

  return (
    <div className="NavBar">
      <div
        className={
          "NavBar__button" +
          (state.menuKind === MenuKind.Home ? " NavBar__button--current" : "")
        }
        onClick={navigateToHomeMenu}
      >
        Home
      </div>
      <div
        className={
          "NavBar__button" +
          (state.menuKind === MenuKind.Stamps ? " NavBar__button--current" : "")
        }
        onClick={navigateToStampsMenu}
      >
        Stamps
      </div>
      <div
        className={
          "NavBar__button" +
          (state.menuKind === MenuKind.Events ? " NavBar__button--current" : "")
        }
        onClick={navigateToEventsMenu}
      >
        Events
      </div>
    </div>
  );
}

function HomeMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const sortedEventsRecentFirst = state.events
    .filter((x) => !x.redacted)
    .sort((a, b) => b.time - a.time);
  const isLastEventInProgress =
    sortedEventsRecentFirst.length > 0 &&
    sortedEventsRecentFirst[0].name.startsWith("▶️");
  return (
    <div className="PageMenu PageMenu--home">
      <div className="PageMenu--home__stamps">
        <ul className="StampList">
          {isLastEventInProgress
            ? [
                <StampableStamp
                  stateHook={stateHook}
                  name={sortedEventsRecentFirst[0].name.replace(/▶️/g, "⏹️")}
                  key={sortedEventsRecentFirst[0].name.replace(/▶️/g, "⏹️")}
                />,
              ]
            : state.stamps.map((stamp) => (
                <StampableStamp
                  stateHook={stateHook}
                  name={"▶️ " + stamp}
                  key={stamp}
                />
              ))}
        </ul>
      </div>
      <div className="PageMenu--home__previousEvent">
        {sortedEventsRecentFirst.length > 0 && (
          <StampableStamp
            stateHook={stateHook}
            name={sortedEventsRecentFirst[0].name}
          />
        )}
      </div>
    </div>
  );
}

function StampableStamp({
  stateHook,
  name,
}: StateHookProps & { name: string }) {
  const [, setState] = stateHook;

  function addEventNow() {
    setState((state) => ({
      ...state,
      events: [
        ...state.events,
        {
          name,
          time: Date.now(),
          redacted: false,
        },
      ],
    }));
  }

  return (
    <li className="Stamp Stamp--stampable">
      <span className="Stamp__name">{name}</span>
      <button className="Stamp__button">🕒</button>
      <button className="Stamp__button" onClick={addEventNow}>
        💮
      </button>
    </li>
  );
}

function StampsMenu({ stateHook }: StateHookProps) {
  return <div className="PageMenu">TODO</div>;
}

function EventsMenu({ stateHook }: StateHookProps) {
  return <div className="PageMenu">TODO</div>;
}
