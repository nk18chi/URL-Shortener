import { App } from "./server";
import cors from "cors";
import express from "express";
import supertest from "supertest";

jest.mock("cors");
jest.mock("./routes/short-url-1");
express.json = jest.fn();

const originalEnv = process.env;
const app = new App();
const request = supertest(app.express);
app.express.use = jest.fn();
app.express.listen = jest.fn();

describe("server.ts", () => {
  beforeEach(() => {
    jest.resetModules();
    app.start();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("start()", () => {
    test("use(cors()) is called", () => {
      expect(cors).toBeCalledTimes(1);
    });
    test("use(express.json()) is called", () => {
      expect(express.json).toBeCalledTimes(1);
    });
    test("route.methods() is called", () => {
      app["routes"].map((route) => {
        expect(route.methods).toBeCalledTimes(1);
      });
    });
    test("use(errorHandler) is called", async () => {
      const response = await request.get("/error");
      expect(response.statusCode).toBe(404);
    });
    test("listen(port, fn) is called in production", () => {
      process.env = {
        ...originalEnv,
        NODE_ENV: "production",
      };
      app.start();
      expect(app.express.listen).toBeCalledTimes(1);
      expect(app.express.listen).toHaveBeenCalledWith(Number(process.env.PORT), expect.anything());
    });
    test("listen(port, fn) is not called in testing", () => {
      expect(app.express.listen).toBeCalledTimes(0);
    });
  });
});
