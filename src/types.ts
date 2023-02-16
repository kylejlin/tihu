import type * as React from "react";

export interface Props {
  readonly stateProvider: StateProvider;
}

export interface StateProvider {
  readonly getSavedState: (this: unknown) => null | State;
  readonly saveState: (this: unknown, state: State) => void;
}

export interface State {
  readonly stateVersion: number;

  readonly dateDotNow: number;

  readonly menuKind: MenuKind;

  readonly stamps: readonly string[];
  readonly stampAboutToBeDeleted: null | string;
  readonly tentativeNewStamp: string;

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

/** We call it `TihuEvent` to avoid a name clash with the native `Event`. */
export interface TihuEvent {
  readonly eventKind: TihuEventKind;
  readonly stamp: string;
  /** Number of milliseconds since the JS Date epoch. */
  readonly time: number;
}

export enum TihuEventKind {
  Start,
  End,
}

export enum EventsMenuKind {
  List,
  Stats,
}

export type LastEventTimeValidity = ValidLastEventTime | InvalidLastEventTime;

export interface ValidLastEventTime {
  readonly isValid: true;
  readonly validTime: Date;
}

export interface InvalidLastEventTime {
  readonly isValid: false;
}

export interface DayStats {
  readonly dateDotNow: number;
  readonly stampDistribution: readonly [string, number][];
  readonly unknownProportion: number;
}

export interface TihuEventPair {
  readonly start: TihuEvent;
  readonly end: TihuEvent;
}
