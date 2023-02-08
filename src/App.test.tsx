import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { localStorageStateProvider } from "./stateProviders/localStorage";

test("renders without crashing", () => {
  render(<App stateProvider={localStorageStateProvider} />);
});
