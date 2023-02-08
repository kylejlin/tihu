import type * as React from "react";

export interface Props {
  readonly stateProvider: StateProvider;
}

export interface StateProvider {
  readonly getSavedState: (this: unknown) => null | State;
  readonly saveState: (this: unknown, state: State) => void;
}

export interface State {
  readonly loggableEventNames: readonly string[];
  readonly isEditingLoggableEventNames: boolean;
  readonly tentativeNewLoggableEventName: string;

  readonly events: readonly Event[];
  readonly showRedactedEvents: boolean;
}

export type StateHook = readonly [
  State,
  React.Dispatch<React.SetStateAction<State>>
];

export interface StateHookProps {
  readonly stateHook: StateHook;
}

export interface Event {
  readonly name: string;
  /** Number of milliseconds since the JS Date epoch. */
  readonly time: number;
  readonly redacted: boolean;
}
