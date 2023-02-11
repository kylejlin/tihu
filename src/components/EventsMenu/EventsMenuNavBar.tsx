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
