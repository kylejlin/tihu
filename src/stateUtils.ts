import {
  dayFloor,
  getOrCreate,
  intoPairs,
  MILLIS_IN_DAY,
  parseTihuDateTimeString,
  UNKNOWN_STAMP,
} from "./misc";
import {
  State,
  MenuKind,
  EventsMenuKind,
  LastEventTimeValidity,
  DayStats,
  TihuEvent,
  TihuEventKind,
  TihuEventPair,
} from "./types";

export const CURRENT_STATE_VERSION = 1;

export function getDefaultState({ dateDotNow }: { dateDotNow: number }): State {
  return {
    stateVersion: CURRENT_STATE_VERSION,

    dateDotNow,

    menuKind: MenuKind.Home,

    stamps: ["🛏️", "🏋️", "🦷", "🍛", "📝", "🎏", "🏖️"],
    stampAboutToBeDeleted: null,
    tentativeNewStamp: "",

    events: [],
    eventsMenuKind: EventsMenuKind.List,
    isAskingForEventDeletionConfirmation: false,
    tentativeLastEventTime: null,
    lastEventTimeEditStartDateDotNow: null,
  };
}

export function isTentativeLastEventTimeValid(
  state: State,
  dateDotNow: number
): LastEventTimeValidity {
  if (state.tentativeLastEventTime === null) {
    return { isValid: false };
  }
  const lastTime = parseTihuDateTimeString(state.tentativeLastEventTime);
  if (lastTime === null) {
    return { isValid: false };
  }
  if (lastTime.valueOf() > dateDotNow) {
    return { isValid: false };
  }
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);

  if (
    sortedEventsRecentFirst.length < 2 ||
    lastTime.valueOf() > sortedEventsRecentFirst[1].time
  ) {
    return { isValid: true, validTime: lastTime };
  }
  return { isValid: false };
}

/**
 * The new stamp must...
 * 1. ...not contain any whitespace
 * 2. ...not be empty
 * 3. ...not equal the Unknown stamp
 * 4. ...not already exist
 */
export function isTentativeNewStampValid(state: State): boolean {
  return (
    !/\s/.test(state.tentativeNewStamp) &&
    state.tentativeNewStamp.length > 0 &&
    state.tentativeNewStamp !== UNKNOWN_STAMP &&
    !state.stamps.includes(state.tentativeNewStamp)
  );
}

export function getAllDayStats(state: State): readonly DayStats[] {
  const eventPairs = getEventPairs(state);
  const maps = new Map<number, Map<string, number>>();
  for (const eventPair of eventPairs) {
    const days = getDaysSpanned(eventPair);
    for (const day of days) {
      const durationMap: Map<string, number> = getOrCreate(
        maps,
        day.valueOf(),
        () => new Map()
      );
      const contributedMillis = getMillisContributedToDay(day, eventPair);
      const existingMillis = durationMap.get(eventPair.start.stamp) ?? 0;
      durationMap.set(
        eventPair.start.stamp,
        existingMillis + contributedMillis
      );
    }
  }
  return [...maps.entries()].map(([dayDateDotNow, durationMap]) =>
    getDayStatsFromDurationMap(new Date(dayDateDotNow), durationMap)
  );
}

export function getEventPairs(state: State): readonly TihuEventPair[] {
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);

  const asIs = intoPairs(sortedEventsRecentFirst);
  if (asIs !== null) {
    return asIs.map(([end, start]) => ({ end, start }));
  }

  const fakePrev: TihuEvent = {
    ...sortedEventsRecentFirst[0],
    time: state.dateDotNow,
    eventKind: TihuEventKind.End,
  };
  const withFakePrev = [fakePrev].concat(sortedEventsRecentFirst);
  return intoPairs(withFakePrev)!.map(([end, start]) => ({ end, start }));
}

export function getDaysSpanned(eventPair: TihuEventPair): readonly Date[] {
  const days = [];
  const startDay = dayFloor(new Date(eventPair.start.time));
  for (
    let day = startDay;
    day.valueOf() <= eventPair.end.time;
    day = new Date(day.valueOf() + MILLIS_IN_DAY)
  ) {
    days.push(day);
  }
  return days;
}

export function getMillisContributedToDay(
  day: Date,
  eventPair: TihuEventPair
): number {
  const dayFloor = day.valueOf();
  const dayCeiling = dayFloor + MILLIS_IN_DAY;
  const start = Math.max(eventPair.start.time, dayFloor);
  const end = Math.min(eventPair.end.time, dayCeiling);
  return end - start;
}

export function getDayStatsFromDurationMap(
  day: Date,
  durationMap: Map<string, number>
): DayStats {
  const stampDistribution: [string, number][] = [...durationMap.entries()].map(
    ([stamp, millis]) => [stamp, millis / MILLIS_IN_DAY]
  );
  const knownProportion = stampDistribution.reduce(
    (acc, [, proportion]) => acc + proportion,
    0
  );
  const unknownProportion = 1 - knownProportion;
  return {
    dateDotNow: day.valueOf(),
    stampDistribution,
    unknownProportion,
  };
}
