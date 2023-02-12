import React from "react";
import { StateHookProps } from "../types";
import "../App.css";

export function Stamp({
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
        },
      ],
      tentativeLastEventTime: null,
      isAskingForEventDeletionConfirmation: false,
      lastEventTimeEditStartDateDotNow: null,
    }));
  }

  return (
    <li className="BarListItem BarListItem--stamp">
      <span className="BarListItem__Name">{name}</span>
      {stampable && (
        <button
          className="BarListItem__Button BarListItem__Button--stamp"
          onClick={addEventNow}
        >
          +
        </button>
      )}
    </li>
  );
}

export function StampableStamp(props: StateHookProps & { name: string }) {
  return <Stamp {...props} stampable={true} />;
}
