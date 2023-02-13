import React from "react";
import { StateHookProps, TihuEventKind } from "../types";
import "../App.css";
import { getEventKindString } from "../misc";

export function StampBar({
  stateHook,
  stamp,
  eventKind,
  deletable,
}: StateHookProps & {
  stamp: string;
  eventKind: null | TihuEventKind;
  deletable: boolean;
}) {
  const [state, setState] = stateHook;

  function addEventNow(eventKind: TihuEventKind) {
    setState((state) => ({
      ...state,
      events: [
        ...state.events,
        {
          eventKind,
          stamp: stamp,
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
      stampAboutToBeDeleted: null,
    }));
  }

  return (
    <li className="BarListItem BarListItem--stamp">
      <span className="BarListItem__Name">{stamp}</span>
      {eventKind !== null && (
        <button
          className="BarListItem__Button BarListItem__Button--stamp"
          onClick={() => addEventNow(eventKind)}
        >
          {getEventKindString(eventKind)}
        </button>
      )}

      {state.stampAboutToBeDeleted === stamp ? (
        <>
          <button
            className="BarListItem__Button BarListItem__Button--stamp BarListItem__Button--event--finalDelete"
            onClick={() => removeStamp(stamp)}
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
          onClick={() => askForStampDeletionConfirmation(stamp)}
        >
          🗑️
        </button>
      ) : null}
    </li>
  );
}
