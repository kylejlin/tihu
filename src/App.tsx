import React, { useState, useEffect, ReactNode } from "react";
import "./App.css";
import { EventsMenu } from "./components/EventsMenu";
import { HomeMenu } from "./components/HomeMenu";
import { NavBar } from "./components/NavBar";
import { StampsMenu } from "./components/StampsMenu";
import { getDefaultState } from "./stateUtils";
import { Props, MenuKind } from "./types";

function App({ stateProvider }: Props) {
  const stateHook = useState(
    stateProvider.getSavedState() ?? getDefaultState()
  );
  const [state] = stateHook;

  useEffect(() => {
    stateProvider.saveState(state);
  });

  const activeMenu = ((): ReactNode => {
    switch (state.menuKind) {
      case MenuKind.Home:
        return <HomeMenu stateHook={stateHook} />;
      case MenuKind.Stamps:
        return <StampsMenu stateHook={stateHook} />;
      case MenuKind.Events:
        return <EventsMenu stateHook={stateHook} />;
    }
  })();

  return (
    <div className="App">
      {activeMenu}

      <NavBar stateHook={stateHook} />
    </div>
  );
}

export default App;
