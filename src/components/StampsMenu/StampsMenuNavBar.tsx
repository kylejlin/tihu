import React from "react";
import { StateHookProps, StampsMenuKind } from "../../types";
import "../../App.css";

export function StampsMenuNavBar({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;

  function navigateToStampList() {
    setState((state) => ({
      ...state,
      stampsMenuKind: StampsMenuKind.List,
    }));
  }

  function navigateToAddStampMenu() {
    setState((state) => ({
      ...state,
      stampsMenuKind: StampsMenuKind.Add,
    }));
  }

  return (
    <div className="PageMenu--events__EventsMenuNavBar">
      <button
        className={
          "PageMenu--events__EventsMenuNavBar__Button PageMenu--events__EventsMenuNavBar__Button--list" +
          (state.stampsMenuKind === StampsMenuKind.List
            ? " PageMenu--events__EventsMenuNavBar__Button--active"
            : "")
        }
        onClick={navigateToStampList}
      >
        🧐
      </button>
      <button
        className={
          "PageMenu--events__EventsMenuNavBar__Button PageMenu--events__EventsMenuNavBar__Button--line" +
          (state.stampsMenuKind === StampsMenuKind.Add
            ? " PageMenu--events__EventsMenuNavBar__Button--active"
            : "")
        }
        onClick={navigateToAddStampMenu}
      >
        ➕
      </button>
    </div>
  );
}
