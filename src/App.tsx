import React, { useState, useEffect, ReactNode } from "react";
import "./App.css";
import {
  Props,
  State,
  StateHookProps,
  MenuKind,
  EventsMenuKind,
} from "./types";

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
    eventsMenuKind: EventsMenuKind.List,
  };
}

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
          "NavBar__Button" +
          (state.menuKind === MenuKind.Home ? " NavBar__Button--current" : "")
        }
        onClick={navigateToHomeMenu}
      >
        Home
      </div>
      <div
        className={
          "NavBar__Button" +
          (state.menuKind === MenuKind.Stamps ? " NavBar__Button--current" : "")
        }
        onClick={navigateToStampsMenu}
      >
        Stamps
      </div>
      <div
        className={
          "NavBar__Button" +
          (state.menuKind === MenuKind.Events ? " NavBar__Button--current" : "")
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
    .slice()
    .sort((a, b) => b.time - a.time);
  const isLastEventInProgress =
    sortedEventsRecentFirst.length > 0 &&
    sortedEventsRecentFirst[0].name.startsWith("▶️");
  return (
    <div className="PageMenu PageMenu--home">
      <div className="PageMenu--home__Stamps">
        <ul className="BarList BarList--containerFilling">
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
      <div className="PageMenu--home__PreviousEvent">
        {sortedEventsRecentFirst.length > 0 && (
          <Stamp
            stateHook={stateHook}
            name={sortedEventsRecentFirst[0].name}
            stampable={false}
          />
        )}
      </div>
    </div>
  );
}

function StampableStamp(props: StateHookProps & { name: string }) {
  return <Stamp {...props} stampable={true} />;
}

function Stamp({
  stateHook,
  name,
  stampable,
}: StateHookProps & { name: string; stampable: boolean }) {
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
    <li className="BarListItem BarListItem--stamp">
      <span className="BarListItem__Name">{name}</span>
      {stampable && (
        <>
          <button className="BarListItem__Button BarListItem__Button--stamp">
            🕒
          </button>
          <button
            className="BarListItem__Button BarListItem__Button--stamp"
            onClick={addEventNow}
          >
            💮
          </button>
        </>
      )}
    </li>
  );
}

function StampsMenu({ stateHook }: StateHookProps) {
  return <div className="PageMenu">TODO</div>;
}

function EventsMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const activeMenu = ((): ReactNode => {
    switch (state.eventsMenuKind) {
      case EventsMenuKind.List:
        return <EventList stateHook={stateHook} />;
      case EventsMenuKind.Line:
        return <EventLine stateHook={stateHook} />;
    }
  })();

  return (
    <div className="PageMenu PageMenu--events PageMenu--events--eventList">
      {activeMenu}

      <EventsMenuNavBar stateHook={stateHook} />
    </div>
  );
}

function EventsMenuNavBar({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;

  function navigateToEventList() {
    setState((state) => ({
      ...state,
      eventsMenuKind: EventsMenuKind.List,
    }));
  }

  function navigateToEventLine() {
    setState((state) => ({
      ...state,
      eventsMenuKind: EventsMenuKind.Line,
    }));
  }

  return (
    <div className="PageMenu--events__EventsMenuNavBar">
      <button
        className={
          "PageMenu--events__EventsMenuNavBar__Button PageMenu--events__EventsMenuNavBar__Button--list" +
          (state.eventsMenuKind === EventsMenuKind.List
            ? " PageMenu--events__EventsMenuNavBar__Button--active"
            : "")
        }
        onClick={navigateToEventList}
      >
        ✏️
      </button>
      <button
        className={
          "PageMenu--events__EventsMenuNavBar__Button PageMenu--events__EventsMenuNavBar__Button--line" +
          (state.eventsMenuKind === EventsMenuKind.Line
            ? " PageMenu--events__EventsMenuNavBar__Button--active"
            : "")
        }
        onClick={navigateToEventLine}
      >
        📈
      </button>
    </div>
  );
}

function EventList({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);

  function removeLastEvent() {
    setState((state) => {
      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        events: state.events.filter((event) => event.time !== lastEvent.time),
      };
    });
  }

  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        {sortedEventsRecentFirst.map((event, eventIndex) => {
          const time = new Date(event.time);
          const month = time.getMonth() + 1;
          const dayOfMonth = time.getDate();
          const dayOfWeek = "日月火水木金土"[time.getDay()];
          return (
            <li className="BarListItem BarListItem--event" key={event.time}>
              <span className="BarListItem__Name">
                {event.name} {month}/{dayOfMonth} {dayOfWeek}{" "}
                {time.getHours().toString().padStart(2, "0")}:
                {time.getMinutes().toString().padStart(2, "0")}
              </span>
              {eventIndex === 0 && (
                <>
                  <button className="BarListItem__Button BarListItem__Button--event">
                    🕒
                  </button>
                  <button
                    className="BarListItem__Button BarListItem__Button--event"
                    onClick={removeLastEvent}
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EventLine({ stateHook }: StateHookProps) {
  return <div className="PageMenu">TODO</div>;
}

function argMax<T>(array: readonly T[], f: (t: T) => number): T {
  let maxIndex = -1;
  let maxValue = -Infinity;
  for (let i = 0; i < array.length; i++) {
    const value = f(array[i]);
    if (value > maxValue) {
      maxIndex = i;
      maxValue = value;
    }
  }
  return array[maxIndex];
}
