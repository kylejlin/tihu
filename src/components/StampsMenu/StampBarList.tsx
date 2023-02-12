import React from "react";
import { StateHookProps } from "../../types";
import "../../App.css";
import { Stamp } from "../Stamp";

export function StampBarList({ stateHook }: StateHookProps) {
  const [state] = stateHook;

  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        {state.stamps.map((stamp) => (
          <Stamp
            key={stamp}
            stateHook={stateHook}
            stampName={stamp}
            stampable={false}
            deletable={true}
          />
        ))}
      </ul>
    </div>
  );
}