import React, { useState, useEffect, ReactNode } from "react";
import "./App.css";
import { argMax, toShortTimeString } from "./misc";
import { getDefaultState, isTentativeLastEventTimeValid } from "./stateUtils";
import { Props, StateHookProps, MenuKind, EventsMenuKind } from "./types";

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

  function startEditingLastEventTime() {
    setState((state) => {
      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        tentativeLastEventTime: toShortTimeString(new Date(lastEvent.time)),
      };
    });
  }

  function editTentativeLastEventTime(e: React.ChangeEvent<HTMLInputElement>) {
    setState((state) => ({
      ...state,
      tentativeLastEventTime: e.target.value,
    }));
  }

  function stopEditingLastEventTime() {
    setState((state) => {
      const validity = isTentativeLastEventTimeValid(state);
      if (!validity.isValid) {
        return { ...state, tentativeLastEventTime: null };
      }

      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        events: state.events.map((event) =>
          event.time === lastEvent.time
            ? { ...event, time: validity.validTime.valueOf() }
            : event
        ),
        tentativeLastEventTime: null,
      };
    });
  }

  function askForEventDeletionConfirmation() {
    setState((state) => ({
      ...state,
      isAskingForEventDeletionConfirmation: true,
    }));
  }

  function cancelEventDeletion() {
    setState((state) => ({
      ...state,
      isAskingForEventDeletionConfirmation: false,
    }));
  }

  function removeLastEvent() {
    setState((state) => {
      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        events: state.events.filter((event) => event.time !== lastEvent.time),
        isAskingForEventDeletionConfirmation: false,
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
          const tentativeLastEventTimeValidity =
            isTentativeLastEventTimeValid(state);

          return (
            <li className="BarListItem BarListItem--event" key={event.time}>
              <span className="BarListItem__Name">
                {event.name}
                {eventIndex === 0 && state.tentativeLastEventTime !== null ? (
                  <input
                    className={
                      "BarListItem--event__TimeInput" +
                      (!tentativeLastEventTimeValidity.isValid
                        ? " BarListItem--event__TimeInput--invalid"
                        : "")
                    }
                    value={state.tentativeLastEventTime}
                    onChange={editTentativeLastEventTime}
                  />
                ) : (
                  <>
                    {" "}
                    {month}/{dayOfMonth} {dayOfWeek}{" "}
                    {time.getHours().toString().padStart(2, "0")}:
                    {time.getMinutes().toString().padStart(2, "0")}
                  </>
                )}
              </span>
              {eventIndex === 0 &&
                (state.isAskingForEventDeletionConfirmation ? (
                  <>
                    <button
                      className="BarListItem__Button BarListItem__Button--event BarListItem__Button--event--finalDelete"
                      onClick={removeLastEvent}
                    >
                      🗑️
                    </button>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={cancelEventDeletion}
                    >
                      ⬅️
                    </button>
                  </>
                ) : state.tentativeLastEventTime !== null ? (
                  <>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={stopEditingLastEventTime}
                    >
                      {tentativeLastEventTimeValidity.isValid ? "✅" : "❌"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={startEditingLastEventTime}
                    >
                      🕒
                    </button>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={askForEventDeletionConfirmation}
                    >
                      🗑️
                    </button>
                  </>
                ))}
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
