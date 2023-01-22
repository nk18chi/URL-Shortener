import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ShortUrlInput from "./ShortUrlInput";

describe("ShortUrlInput.tsx", () => {
  let error = false;
  let response: any;
  const server = setupServer(
    rest.post("http://localhost:4000/shorten-url", (req, res, ctx) => {
      if (error)
        return res(
          ctx.status(404),
          ctx.json({
            errorMessage: "Api failed",
          })
        );
      return res(ctx.json(response));
    })
  );
  beforeAll(() => server.listen());
  beforeEach(() => {
    error = false;
    response = { shortUrl: "http://localhost:4000/qn73gy" };
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
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
  test("should throw an error when a long url is not set", async () => {
    render(<ShortUrlInput />);
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.click(button);
    expect(await screen.findByText(/Please set a URL/i)).toBeTruthy();
  });
  test('should throw an error when the response from the api does not contain "shortUrl"', async () => {
    render(<ShortUrlInput />);
    response = {};
    const input = screen.getByPlaceholderText("Enter the link to be shortend");
    const button = screen.getByRole("button", { name: "Shorten" });
    fireEvent.change(input, {
      target: { value: "https://dev.to/nk18chi" },
    });
    fireEvent.click(button);
    expect(await screen.findByText(/something went wrong\./i)).toBeTruthy();
  });
  test("should throw an error when the api failed", async () => {
    render(<ShortUrlInput />);
    error = true;
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
    error = true;
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
