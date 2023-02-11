import React, { ReactNode } from "react";
import { StateHookProps, EventsMenuKind } from "../../types";
import "../../App.css";
import { EventLine } from "./EventLine";
import { EventList } from "./EventList";
import { EventsMenuNavBar } from "./EventsMenuNavBar";

export function EventsMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const activeMenu = ((): ReactNode => {
    switch (state.eventsMenuKind) {
      case EventsMenuKind.List:
        return <EventList stateHook={stateHook} />;
      case EventsMenuKind.Line:
        return <EventLine stateHook={stateHook} />;
    }
  })();

  return (
    <div className="PageMenu PageMenu--events PageMenu--events--eventList">
      {activeMenu}

      <EventsMenuNavBar stateHook={stateHook} />
    </div>
  );
}
