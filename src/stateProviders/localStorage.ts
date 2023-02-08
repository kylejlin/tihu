import { StateProvider, State } from "../types";

const LocalStorageKeys = {
  State: "tihu_state",
} as const;

export function getSavedState(): null | State {
  const savedState = localStorage.getItem(LocalStorageKeys.State);
  if (savedState === null) {
    return null;
  }
  return JSON.parse(savedState);
}

export function saveState(state: State): void {
  localStorage.setItem(LocalStorageKeys.State, JSON.stringify(state));
}

export const localStorageStateProvider: StateProvider = {
  getSavedState,
  saveState,
};
