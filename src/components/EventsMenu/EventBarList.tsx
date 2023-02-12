import React from "react";
import { StateHookProps } from "../../types";
import "../../App.css";
import { EventBar } from "./EventBar";

export function EventBarList({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);
  const durations: readonly (null | number | "ACTIVE")[] =
    sortedEventsRecentFirst.length % 2 === 0
      ? sortedEventsRecentFirst.map((event, eventIndex) => {
          if (eventIndex % 2 === 0) {
            return event.time - sortedEventsRecentFirst[eventIndex + 1].time;
          }
          // return sortedEventsRecentFirst[eventIndex - 1].time - event.time;
          return null;
        })
      : sortedEventsRecentFirst.map((event, eventIndex) => {
          if (eventIndex === 0) {
            return "ACTIVE";
          }
          if (eventIndex % 2 === 0) {
            // return sortedEventsRecentFirst[eventIndex - 1].time - event.time;
            return null;
          }
          return event.time - sortedEventsRecentFirst[eventIndex + 1].time;
        });

  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        {sortedEventsRecentFirst.map((event, eventIndex) => (
          <EventBar
            key={event.time}
            stateHook={stateHook}
            event={event}
            recencyIndex={eventIndex}
            durationMillis={durations[eventIndex]}
          />
        ))}
      </ul>
    </div>
  );
}
