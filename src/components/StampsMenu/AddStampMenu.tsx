import React from "react";
import "../../App.css";
import { StateHookProps } from "../../types";
import { Stamp } from "../Stamp";

export function AddStampMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const todoIsValid = true;
  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        <li className="BarListItem BarListItem--stamp">
          <input
            className={
              "BarListItem--event__TimeInput" +
              (!todoIsValid ? " BarListItem--event__TimeInput--invalid" : "")
            }
            value={"todostampname"}
            readOnly
          />

          <button className="BarListItem__Button BarListItem__Button--stamp">
            {todoIsValid ? "✅" : "❌"}
          </button>
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
