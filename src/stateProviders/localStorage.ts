import { CURRENT_STATE_VERSION } from "../stateUtils";
import { StateProvider, State } from "../types";

const LocalStorageKeys = {
  State: "tihu_state",
} as const;

export function getSavedState(): null | State {
  const savedState = localStorage.getItem(LocalStorageKeys.State);
  if (savedState === null) {
    return null;
  }
  try {
    const state: State = JSON.parse(savedState);
    if (state.stateVersion === CURRENT_STATE_VERSION) {
      return state;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveState(state: State): void {
  localStorage.setItem(LocalStorageKeys.State, JSON.stringify(state));
}

export const localStorageStateProvider: StateProvider = {
  getSavedState,
  saveState,
};
