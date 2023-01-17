import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ShortUrlInput from "./ShortUrlInput";

describe("ShortUrlInput.tsx", () => {
  test("should show an input box", () => {
    render(<ShortUrlInput />);
    expect(screen.getByPlaceholderText("Enter the link to be shortend")).toBeInTheDocument();
  });
  test("should show a shorten button", () => {
    render(<ShortUrlInput />);
    expect(screen.getByRole("button", { name: "Shorten" })).toBeInTheDocument();
  });
  test("should show a short url when a button is hit", async () => {
    render(<ShortUrlInput />);
    const input = screen.getByPlaceholderText("Enter the link to be shortend");
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.change(input, {
      target: { value: "https://dev.to/nk18chi/built-a-url-shortener-using-react-and-nodeexpress-m86-temp-slug-6631774" },
    });
    fireEvent.click(button);
    expect(await screen.findByText(/A short URL was successfuly generated!/i)).toBeTruthy();
  });
  test("should show a loading when calling an api", async () => {
    render(<ShortUrlInput />);
    const input = screen.getByPlaceholderText("Enter the link to be shortend");
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.change(input, {
      target: { value: "https://dev.to/nk18chi/built-a-url-shortener-using-react-and-nodeexpress-m86-temp-slug-6631774" },
    });
    fireEvent.click(button);
    expect(await screen.findByTestId("short-url-input-loading")).toBeTruthy();
  });
  test("should remove a short url when a long url has changed", async () => {
    render(<ShortUrlInput />);
    const input = screen.getByPlaceholderText("Enter the link to be shortend");
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.change(input, {
      target: { value: "https://dev.to/nk18chi/built-a-url-shortener-using-react-and-nodeexpress-m86-temp-slug-6631774" },
    });
    fireEvent.click(button);
    expect(await screen.findByText(/A short URL was successfuly generated!/i)).toBeTruthy();
    fireEvent.change(input, {
      target: { value: "https://dev.to/nk18chi" },
    });
    await waitFor(() => {
      expect(screen.queryByText(/A short URL was successfuly generated!/i)).toBeFalsy();
    });
  });
  test("should throw an error when a long url does not exist", async () => {
    render(<ShortUrlInput />);
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.click(button);
    expect(await screen.findByText(/Error!/i)).toBeTruthy();
  });
  test('should throw an error when a long url does not start with "http://" or "https://"', async () => {
    render(<ShortUrlInput />);
    const input = screen.getByPlaceholderText("Enter the link to be shortend");
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.change(input, {
      target: { value: "dev.to" },
    });
    fireEvent.click(button);
    expect(await screen.findByText(/Error!/i)).toBeTruthy();
  });
  test("should remove an error message when a long url has changed", async () => {
    render(<ShortUrlInput />);
    const input = screen.getByPlaceholderText("Enter the link to be shortend");
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.click(button);
    expect(await screen.findByText(/Error!/i)).toBeTruthy();
    fireEvent.change(input, { target: { value: "https://dev.to/nk18chi" } });
    await waitFor(() => {
      expect(screen.queryByText(/Error!/i)).toBeFalsy();
    });
  });
});
