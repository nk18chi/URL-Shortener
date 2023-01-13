import { ShortURL } from "./short-url-2";
import supertest from "supertest";
import crypto from "node:crypto";
import { App } from "../server";

const app = new App();
ShortURL["keySize"] = 1;
app["routes"] = [new ShortURL()];
app.start();
const request = supertest(app.express);

describe("server_2.ts", () => {
  let randomBytes = {};
  beforeEach(() => {
    app["routes"].map((route) => route.initialize());
    randomBytes = {
      toString: jest.fn().mockImplementation(() => "12345"),
    };
    jest.spyOn(crypto, "randomBytes").mockImplementation(() => randomBytes);
  });

  describe("POST /shorten-url", () => {
    test("return a new shorten url", async () => {
      const response = await request.post("/shorten-url").send({ url: "http://test.com" });
      expect(response.statusCode).toBe(200);
      expect(response.body.shortUrl).toMatch(/http:\/\/localhost:4000\/[0-9a-zA-Z]/);
    });
    test("throw an error if a url is not set up", async () => {
      const response = await request.post("/shorten-url").send({});
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("url is necessary");
    });
    test("throw an error if a url does not have http or https", async () => {
      const response = await request.post("/shorten-url").send({ url: "test.com" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("URL should start with 'http://' or 'https://'");
    });
    test("throw an error if keys ran out", async () => {
      for (let i = 0; i < ShortURL["keySize"]; i++) {
        await request.post("/shorten-url").send({ url: "http://test.com" });
      }
      const response = await request.post("/shorten-url").send({ url: "http://test.com" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("the unique key ran out");
    });
  });

  describe("POST /:id", () => {
    test("redirect to the long url", async () => {
      const url = "http://test.com";
      await request.post("/shorten-url").send({ url });
      const response = await request.get("/12345");
      expect(response.statusCode).toBe(302);
      expect(response.header.location).toBe(url);
    });
    test("throw an error if the shor url has not been created yet", async () => {
      const response = await request.get("/aaa");
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("the short url is not corrct");
    });
  });
});
