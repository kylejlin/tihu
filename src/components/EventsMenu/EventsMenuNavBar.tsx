import React from "react";
import { StateHookProps, EventsMenuKind } from "../../types";
import "../../App.css";

export function EventsMenuNavBar({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;

  function navigateToEventList() {
    setState((state) => ({
      ...state,
      eventsMenuKind: EventsMenuKind.List,
    }));
  }

  function navigateToEventStatsMenu() {
    setState((state) => ({
      ...state,
      eventsMenuKind: EventsMenuKind.Stats,
    }));
  }

  function navigateToEventExportMenu() {
    setState((state) => ({
      ...state,
      eventsMenuKind: EventsMenuKind.Export,
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
          "PageMenu--events__EventsMenuNavBar__Button PageMenu--events__EventsMenuNavBar__Button--stats" +
          (state.eventsMenuKind === EventsMenuKind.Stats
            ? " PageMenu--events__EventsMenuNavBar__Button--active"
            : "")
        }
        onClick={navigateToEventStatsMenu}
      >
        📈
      </button>
      <button
        className={
          "PageMenu--events__EventsMenuNavBar__Button PageMenu--events__EventsMenuNavBar__Button--export" +
          (state.eventsMenuKind === EventsMenuKind.Export
            ? " PageMenu--events__EventsMenuNavBar__Button--active"
            : "")
        }
        onClick={navigateToEventExportMenu}
      >
        📦
      </button>
    </div>
  );
}
