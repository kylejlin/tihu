import type * as React from "react";

export interface Props {
  readonly stateProvider: StateProvider;
}

export interface StateProvider {
  readonly getSavedState: (this: unknown) => null | State;
  readonly saveState: (this: unknown, state: State) => void;
}

export interface State {
  readonly dateDotNow: number;

  readonly menuKind: MenuKind;

  readonly stamps: readonly string[];
  readonly stampsMenuKind: StampsMenuKind;
  readonly stampAboutToBeDeleted: null | string;

  readonly events: readonly TihuEvent[];
  readonly eventsMenuKind: EventsMenuKind;
  readonly isAskingForEventDeletionConfirmation: boolean;
  readonly tentativeLastEventTime: null | string;
  readonly lastEventTimeEditStartDateDotNow: null | number;
}

export enum MenuKind {
  Home,
  Stamps,
  Events,
}

export type StateHook = readonly [
  State,
  React.Dispatch<React.SetStateAction<State>>
];

export interface StateHookProps {
  readonly stateHook: StateHook;
}

export enum StampsMenuKind {
  List,
  Add,
}

/** We call it `TihuEvent` to avoid a name clash with the native `Event`. */
export interface TihuEvent {
  readonly name: string;
  /** Number of milliseconds since the JS Date epoch. */
  readonly time: number;
}

export enum EventsMenuKind {
  List,
  Line,
}

export type LastEventTimeValidity = ValidLastEventTime | InvalidLastEventTime;

export interface ValidLastEventTime {
  readonly isValid: true;
  readonly validTime: Date;
}

export interface InvalidLastEventTime {
  readonly isValid: false;
}
