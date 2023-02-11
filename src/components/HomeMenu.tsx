import React from "react";
import { StateHookProps } from "../types";
import "../App.css";
import { StampableStamp } from "./Stamp";
import { EventBar } from "./EventsMenu/EventBar";

export function HomeMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);
  const isLastEventInProgress =
    sortedEventsRecentFirst.length > 0 &&
    sortedEventsRecentFirst[0].name.startsWith("▶️");
  const previousEventDurationMillis =
    sortedEventsRecentFirst.length >= 2 &&
    sortedEventsRecentFirst.length % 2 === 0
      ? sortedEventsRecentFirst[0].time - sortedEventsRecentFirst[1].time
      : null;
  return (
    <div className="PageMenu PageMenu--home">
      <div className="PageMenu--home__Stamps">
        <ul className="BarList BarList--containerFilling">
          {isLastEventInProgress
            ? [
                <StampableStamp
                  stateHook={stateHook}
                  name={sortedEventsRecentFirst[0].name.replace(/▶️/g, "⏹️")}
                  key={sortedEventsRecentFirst[0].name.replace(/▶️/g, "⏹️")}
                />,
              ]
            : state.stamps.map((stamp) => (
                <StampableStamp
                  stateHook={stateHook}
                  name={"▶️ " + stamp}
                  key={stamp}
                />
              ))}
        </ul>
      </div>
      <div className="PageMenu--home__PreviousEvent">
        {sortedEventsRecentFirst.length > 0 && (
          <EventBar
            stateHook={stateHook}
            event={sortedEventsRecentFirst[0]}
            recencyIndex={0}
            durationMillis={previousEventDurationMillis ?? undefined}
          />
        )}
      </div>
    </div>
  );
}
