import React from "react";
import { StateHookProps } from "../../types";
import "../../App.css";
import { StampBar } from "../StampBar";
import { isTentativeNewStampValid } from "../../stateUtils";

export function StampsMenu({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);
  const tentativeNewStampValid = isTentativeNewStampValid(state);

  function editTentativeNewStamp(e: React.ChangeEvent<HTMLInputElement>) {
    setState((state) => ({ ...state, tentativeNewStamp: e.target.value }));
  }

  function addTentativeNewStamp() {
    setState((state) => ({
      ...state,
      stamps: state.stamps.concat([state.tentativeNewStamp]),
      tentativeNewStamp: "",
    }));
  }

  function clearTentativeStampAndNavigateToStampList() {
    setState((state) => ({
      ...state,
      tentativeNewStamp: "",
    }));
  }

  return (
    <div className="PageMenu PageMenu--home">
      <div className="PageMenu--home__Stamps">
        <ul className="BarList BarList--containerFilling">
          {state.stamps.map((stamp) => (
            <StampBar
              key={stamp}
              stateHook={stateHook}
              stamp={stamp}
              eventKind={null}
              deletable={true}
            />
          ))}
        </ul>
      </div>
      <div className="PageMenu--home__PreviousEvent">
        {sortedEventsRecentFirst.length > 0 && (
          <li className="BarListItem BarListItem--stamp BarListItem--stamp--tentativeStamp">
            <span className="BarListItem__Label">Add</span>

            <input
              className={
                "BarListItem--event__TimeInput" +
                (!tentativeNewStampValid
                  ? " BarListItem--event__TimeInput--invalid"
                  : "")
              }
              value={state.tentativeNewStamp}
              onChange={editTentativeNewStamp}
            />

            {tentativeNewStampValid ? (
              <button
                className="BarListItem__Button BarListItem__Button--stamp"
                onClick={addTentativeNewStamp}
              >
                ✅
              </button>
            ) : (
              <button
                className="BarListItem__Button BarListItem__Button--stamp"
                onClick={clearTentativeStampAndNavigateToStampList}
              >
                ❌
              </button>
            )}
          </li>
        )}
      </div>
    </div>
  );
}
