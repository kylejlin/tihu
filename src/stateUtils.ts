import { parseTihuTimeString } from "./misc";
import {
  State,
  MenuKind,
  EventsMenuKind,
  LastEventTimeValidity,
} from "./types";

export function getDefaultState(): State {
  return {
    menuKind: MenuKind.Home,

    stamps: ["🛏️", "🏋️", "🦷", "🍛", "📝", "🎏", "🏖️"],

    events: [],
    eventsMenuKind: EventsMenuKind.List,
    isAskingForEventDeletionConfirmation: false,
    tentativeLastEventTime: null,
  };
}

export function isTentativeLastEventTimeValid(
  state: State
): LastEventTimeValidity {
  if (state.tentativeLastEventTime === null) {
    return { isValid: false };
  }
  const lastTime = parseTihuTimeString(state.tentativeLastEventTime);
  if (lastTime === null) {
    return { isValid: false };
  }
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);
  if (
    sortedEventsRecentFirst.length < 2 ||
    lastTime.valueOf() >= sortedEventsRecentFirst[1].time
  ) {
    return { isValid: true, validTime: lastTime };
  }
  return { isValid: false };
}
