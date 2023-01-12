import supertest from "supertest";
import crypto from "node:crypto";
import app from "./server";

const request = supertest(app);
describe("server.ts", () => {
  let randomBytes = {};
  beforeEach(() => {
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
      expect(crypto.randomBytes).toBeCalledTimes(1);
      expect(randomBytes.toString).toBeCalledTimes(1);
    });
    test("throw an error if a url is not set up", async () => {
      const response = await request.post("/shorten-url").send({});
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("url is necessary");
      expect(crypto.randomBytes).toBeCalledTimes(0);
    });
    test("throw an error if a url does not have http or https", async () => {
      const response = await request.post("/shorten-url").send({ url: "test.com" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("URL should start with 'http://' or 'https://'");
      expect(crypto.randomBytes).toBeCalledTimes(0);
    });
    test("throw an error if a generated key is duplicated", async () => {
      await request.post("/shorten-url").send({ url: "http://test.com" });
      expect(crypto.randomBytes).toBeCalledTimes(1);
      expect(randomBytes.toString).toBeCalledTimes(1);
      const response = await request.post("/shorten-url").send({ url: "http://test.com" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("key is duplicated");
      expect(crypto.randomBytes).toBeCalledTimes(2);
      expect(randomBytes.toString).toBeCalledTimes(2);
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
