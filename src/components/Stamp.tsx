import React from "react";
import { StateHookProps } from "../types";
import "../App.css";

export function Stamp({
  stateHook,
  stampName,
  stampable,
  deletable,
}: StateHookProps & {
  stampName: string;
  stampable: boolean;
  deletable: boolean;
}) {
  const [state, setState] = stateHook;

  function addEventNow() {
    setState((state) => ({
      ...state,
      events: [
        ...state.events,
        {
          name: stampName,
          time: Date.now(),
        },
      ],
      tentativeLastEventTime: null,
      isAskingForEventDeletionConfirmation: false,
      lastEventTimeEditStartDateDotNow: null,
    }));
  }

  function askForStampDeletionConfirmation(stamp: string) {
    setState((state) => ({
      ...state,
      stampAboutToBeDeleted: stamp,
    }));
  }

  function cancelStampDeletion() {
    setState((state) => ({
      ...state,
      stampAboutToBeDeleted: null,
    }));
  }

  function removeStamp(stamp: string) {
    setState((state) => ({
      ...state,
      stamps: state.stamps.filter((s) => s !== stamp),
    }));
  }

  return (
    <li className="BarListItem BarListItem--stamp">
      <span className="BarListItem__Name">{stampName}</span>
      {stampable && (
        <button
          className="BarListItem__Button BarListItem__Button--stamp"
          onClick={addEventNow}
        >
          {String.fromCodePoint(stampName.codePointAt(0)!)}
        </button>
      )}

      {state.stampAboutToBeDeleted === stampName ? (
        <>
          <button
            className="BarListItem__Button BarListItem__Button--stamp BarListItem__Button--event--finalDelete"
            onClick={() => removeStamp(stampName)}
          >
            🗑️
          </button>
          <button
            className="BarListItem__Button BarListItem__Button--stamp"
            onClick={cancelStampDeletion}
          >
            ⬅️
          </button>
        </>
      ) : deletable ? (
        <button
          className="BarListItem__Button BarListItem__Button--stamp"
          onClick={() => askForStampDeletionConfirmation(stampName)}
        >
          🗑️
        </button>
      ) : null}
    </li>
  );
}

export function StampableStamp(props: StateHookProps & { stampName: string }) {
  return <Stamp {...props} stampable={true} deletable={false} />;
}
