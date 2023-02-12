import React from "react";
import "../../App.css";
import { isTentativeNewStampValid } from "../../stateUtils";
import { StampsMenuKind, StateHookProps } from "../../types";
import { Stamp } from "../Stamp";

export function AddStampMenu({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;
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
      stampsMenuKind: StampsMenuKind.List,
      tentativeNewStamp: "",
    }));
  }

  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        <li className="BarListItem BarListItem--stamp">
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

        {state.stamps.map((stamp) => (
          <Stamp
            key={stamp}
            stateHook={stateHook}
            stampName={stamp}
            stampable={false}
            deletable={false}
          />
        ))}
      </ul>
    </div>
  );
}