import React, { useState, useEffect, ReactNode } from "react";
import "./App.css";
import { Props, State, StateHookProps, MenuKind } from "./types";

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
    <li className="Stamp Stamp--stampable">
      <span className="Stamp__name">{name}</span>
      {stampable && (
        <>
          <button className="Stamp__button">🕒</button>
          <button className="Stamp__button" onClick={addEventNow}>
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
  return <div className="PageMenu">TODO</div>;
}
