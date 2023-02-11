import React from "react";
import { StateHookProps } from "../../types";
import "../../App.css";
import { EventBar } from "./EventBar";

export function EventBarList({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);

  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        {sortedEventsRecentFirst.map((event, eventIndex) => (
          <EventBar
            key={event.time}
            stateHook={stateHook}
            event={event}
            recencyIndex={eventIndex}
          />
        ))}
      </ul>
    </div>
  );
}
