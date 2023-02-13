import React from "react";
import { StateHookProps } from "../../types";
import "../../App.css";
import { StampBar } from "../StampBar";

export function StampBarList({ stateHook }: StateHookProps) {
  const [state] = stateHook;

  return (
    <div className="PageMenu--events__EventList">
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
  );
}
