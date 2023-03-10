import React from "react";
import "../../App.css";
import { StateHookProps } from "../../types";
import utf8 from "utf8";

export function EventExportMenu({ stateHook }: StateHookProps) {
  const [state] = stateHook;

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

  return (
    <div className="FillContainerExceptLeaveRoomForBarListItemAtBottom">
      <button onClick={exportState}>Export</button>

      <label>
        <input type="file" onChange={() => alert("TODO")}></input>
        Import
      </label>
    </div>
  );
}
