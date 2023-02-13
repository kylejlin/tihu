import React from "react";
import { StateHookProps, TihuEventKind } from "../types";
import "../App.css";
import { StampBar } from "./StampBar";
import { EventBar } from "./EventsMenu/EventBar";

export function HomeMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);
  const isLastEventInProgress =
    sortedEventsRecentFirst.length > 0 &&
    sortedEventsRecentFirst[0].eventKind === TihuEventKind.Start;
  const previousEventDurationMillis =
    sortedEventsRecentFirst.length >= 2 &&
    sortedEventsRecentFirst.length % 2 === 0
      ? sortedEventsRecentFirst[0].time - sortedEventsRecentFirst[1].time
      : "ACTIVE";
  return (
    <div className="PageMenu PageMenu--home">
      <div className="PageMenu--home__Stamps">
        <ul className="BarList BarList--containerFilling">
          {isLastEventInProgress ? (
            <StampBar
              stateHook={stateHook}
              stamp={sortedEventsRecentFirst[0].stamp}
              eventKind={TihuEventKind.End}
              deletable={false}
            />
          ) : (
            state.stamps.map((stamp) => (
              <StampBar
                key={stamp}
                stateHook={stateHook}
                stamp={stamp}
                eventKind={TihuEventKind.Start}
                deletable={false}
              />
            ))
          )}
        </ul>
      </div>
      <div className="PageMenu--home__PreviousEvent">
        {sortedEventsRecentFirst.length > 0 && (
          <EventBar
            stateHook={stateHook}
            event={sortedEventsRecentFirst[0]}
            recencyIndex={0}
            durationMillis={previousEventDurationMillis}
          />
        )}
      </div>
    </div>
  );
}
