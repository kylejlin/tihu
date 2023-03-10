import React from "react";
import "../../App.css";
import { State, StateHookProps } from "../../types";
import utf8 from "utf8";
import { CURRENT_STATE_VERSION } from "../../stateUtils";

export function EventExportMenu({ stateHook }: StateHookProps) {
  const [state, setState] = stateHook;

  function exportState() {
    const s = JSON.stringify(state);
    const blob = btoa(utf8.encode(s));
    const a = document.createElement("a");
    a.href = "data:application/json;base64," + blob;
    const now = new Date(state.dateDotNow);
    const dateStr =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    a.download = "backup-" + dateStr + ".tihu.json";
    a.click();
  }

  function importEvents() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file === undefined) {
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const { result } = reader;
        if (typeof result !== "string") {
          return;
        }
        try {
          console.log(result);
          const newState: State = JSON.parse(result);
          if (newState.stateVersion !== CURRENT_STATE_VERSION) {
            alert("Incompatible backup file.");
            return;
          }
          const confirmation = window.prompt(
            'Importing events will overwrite your current events. This is irreversible. Type "overwrite" to continue.'
          );
          if (confirmation === "overwrite") {
            setState((state) => ({ ...state, events: newState.events }));
          }
        } catch {
          alert("Invalid file.");
        }
      });
      reader.readAsText(file);
    });
    input.click();
  }

  return (
    <div className="FillContainerExceptLeaveRoomForBarListItemAtBottom">
      <div className="ImportExportButtons">
        <div>
          <button className="ImportExportButton" onClick={exportState}>
            Export
          </button>
        </div>
        <div>
          <button className="ImportExportButton" onClick={importEvents}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
