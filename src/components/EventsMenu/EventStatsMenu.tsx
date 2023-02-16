import React from "react";
import "../../App.css";
import { UNKNOWN_STAMP } from "../../misc";
import { getAllDayStats } from "../../stateUtils";
import { StateHookProps } from "../../types";

export function EventStatsMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;
  const dayStatsRecentFirst = getAllDayStats(state)
    .slice()
    .sort((a, b) => b.dateDotNow - a.dateDotNow);

  return (
    <div className="PageMenu">
      <ul className="DaysWithStats">
        {dayStatsRecentFirst.map((dayStats) => {
          const date = new Date(dayStats.dateDotNow);
          const month = date.getMonth() + 1;
          const dayOfMonth = date.getDate();
          const dayOfWeek = "日月火水木金土"[date.getDay()];

          const stampDistributionLargestFirst = dayStats.stampDistribution
            .slice()
            .sort((a, b) => b[1] - a[1]);

          return (
            <li key={dayStats.dateDotNow}>
              <h3>
                {month}/{dayOfMonth} {dayOfWeek}
              </h3>

              <ul>
                {stampDistributionLargestFirst.map(([stamp, proportion]) => (
                  <li key={stamp}>
                    {stamp} {(proportion * 100).toFixed(1)}%
                  </li>
                ))}
                <li>
                  {UNKNOWN_STAMP}{" "}
                  {(dayStats.unknownProportion * 100).toFixed(1)}%
                </li>
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
