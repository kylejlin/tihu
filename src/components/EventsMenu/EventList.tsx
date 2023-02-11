import React from "react";
import { argMax, toShortTimeString } from "../../misc";
import { isTentativeLastEventTimeValid } from "../../stateUtils";
import { StateHookProps } from "../../types";
import "../../App.css";

export function EventList({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;
  const sortedEventsRecentFirst = state.events
    .slice()
    .sort((a, b) => b.time - a.time);

  function startEditingLastEventTime() {
    setState((state) => {
      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        tentativeLastEventTime: toShortTimeString(new Date(lastEvent.time)),
        lastEventTimeEditStartDateDotNow: Date.now(),
      };
    });
  }

  function editTentativeLastEventTime(e: React.ChangeEvent<HTMLInputElement>) {
    setState((state) => ({
      ...state,
      tentativeLastEventTime: e.target.value,
    }));
  }

  function stopEditingLastEventTime() {
    setState((state) => {
      const validity = isTentativeLastEventTimeValid(
        state,
        state.lastEventTimeEditStartDateDotNow ?? 0
      );
      if (!validity.isValid) {
        return { ...state, tentativeLastEventTime: null };
      }

      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        events: state.events.map((event) =>
          event.time === lastEvent.time
            ? { ...event, time: validity.validTime.valueOf() }
            : event
        ),
        tentativeLastEventTime: null,
      };
    });
  }

  function askForEventDeletionConfirmation() {
    setState((state) => ({
      ...state,
      isAskingForEventDeletionConfirmation: true,
    }));
  }

  function cancelEventDeletion() {
    setState((state) => ({
      ...state,
      isAskingForEventDeletionConfirmation: false,
    }));
  }

  function removeLastEvent() {
    setState((state) => {
      const lastEvent = argMax(state.events, (event) => event.time);
      return {
        ...state,
        events: state.events.filter((event) => event.time !== lastEvent.time),
        isAskingForEventDeletionConfirmation: false,
      };
    });
  }

  return (
    <div className="PageMenu--events__EventList">
      <ul className="BarList BarList--containerFilling">
        {sortedEventsRecentFirst.map((event, eventIndex) => {
          const time = new Date(event.time);
          const month = time.getMonth() + 1;
          const dayOfMonth = time.getDate();
          const dayOfWeek = "日月火水木金土"[time.getDay()];
          const tentativeLastEventTimeValidity = isTentativeLastEventTimeValid(
            state,
            state.lastEventTimeEditStartDateDotNow ?? 0
          );

          return (
            <li className="BarListItem BarListItem--event" key={event.time}>
              <span className="BarListItem__Name">
                {event.name}
                {eventIndex === 0 && state.tentativeLastEventTime !== null ? (
                  <input
                    className={
                      "BarListItem--event__TimeInput" +
                      (!tentativeLastEventTimeValidity.isValid
                        ? " BarListItem--event__TimeInput--invalid"
                        : "")
                    }
                    value={state.tentativeLastEventTime}
                    onChange={editTentativeLastEventTime}
                  />
                ) : (
                  <>
                    {" "}
                    {month}/{dayOfMonth} {dayOfWeek}{" "}
                    {time.getHours().toString().padStart(2, "0")}:
                    {time.getMinutes().toString().padStart(2, "0")}
                  </>
                )}
              </span>
              {eventIndex === 0 &&
                (state.isAskingForEventDeletionConfirmation ? (
                  <>
                    <button
                      className="BarListItem__Button BarListItem__Button--event BarListItem__Button--event--finalDelete"
                      onClick={removeLastEvent}
                    >
                      🗑️
                    </button>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={cancelEventDeletion}
                    >
                      ⬅️
                    </button>
                  </>
                ) : state.tentativeLastEventTime !== null ? (
                  <>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={stopEditingLastEventTime}
                    >
                      {tentativeLastEventTimeValidity.isValid ? "✅" : "❌"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={startEditingLastEventTime}
                    >
                      🕒
                    </button>
                    <button
                      className="BarListItem__Button BarListItem__Button--event"
                      onClick={askForEventDeletionConfirmation}
                    >
                      🗑️
                    </button>
                  </>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
