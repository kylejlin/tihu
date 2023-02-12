import React, { ReactNode } from "react";
import { StampsMenuKind, StateHookProps } from "../../types";
import "../../App.css";
import { StampBarList } from "./StampBarList";
import { AddStampMenu } from "./AddStampMenu";
import { StampsMenuNavBar } from "./StampsMenuNavBar";

export function StampsMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const activeMenu = ((): ReactNode => {
    switch (state.stampsMenuKind) {
      case StampsMenuKind.List:
        return <StampBarList stateHook={stateHook} />;
      case StampsMenuKind.Add:
        return <AddStampMenu stateHook={stateHook} />;
    }
  })();

  return (
    <div className="PageMenu PageMenu--events">
      {activeMenu}

      <StampsMenuNavBar stateHook={stateHook} />
    </div>
  );
}
