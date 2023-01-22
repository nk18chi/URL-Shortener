import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App.tsx", () => {
  test("should show a headline", () => {
    render(<App />);
    expect(screen.getByText(/URL Shortener/i)).toBeInTheDocument();
  });
  test("should show a description", () => {
    render(<App />);
    expect(screen.getByText(/Generate a short url and redirect to the long url when a user click the short url./i)).toBeInTheDocument();
  });
  test("should render ShortUrlInput component", () => {
    render(<App />);
    expect(screen.getByTestId("short-url-input")).toBeInTheDocument();
  });
});
