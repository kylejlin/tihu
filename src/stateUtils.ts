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

export function isTentativeNewStampValid(state: State): boolean {
  const stripped = state.tentativeNewStamp.replace(/\s/g, "");
  return stripped.length > 0 && !state.stamps.includes(stripped);
}
