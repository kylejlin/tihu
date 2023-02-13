import { parseTihuDateTimeString } from "./misc";
import {
  State,
  MenuKind,
  EventsMenuKind,
  LastEventTimeValidity,
  StampsMenuKind,
} from "./types";

export function getDefaultState({ dateDotNow }: { dateDotNow: number }): State {
  return {
    dateDotNow,

    menuKind: MenuKind.Home,

    stamps: ["🛏️", "🏋️", "🦷", "🍛", "📝", "🎏", "🏖️"],
    stampsMenuKind: StampsMenuKind.List,
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
 * 3. ...not already exist
 */
export function isTentativeNewStampValid(state: State): boolean {
  return (
    !/\s/.test(state.tentativeNewStamp) &&
    state.tentativeNewStamp.length > 0 &&
    !state.stamps.includes(state.tentativeNewStamp)
  );
}
