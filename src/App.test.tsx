import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { localStorageStateProvider } from "./stateProviders/localStorage";

test("renders learn react link", () => {
  render(<App stateProvider={localStorageStateProvider} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
