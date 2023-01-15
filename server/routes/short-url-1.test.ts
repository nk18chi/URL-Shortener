import { ShortURL } from "./short-url-1";
import supertest from "supertest";
import nanoid from "nanoid";
import { App } from "../server";

const app = new App();
app["routes"] = [new ShortURL()];
app.start();
const request = supertest(app.express);

describe("short-url-1.ts", () => {
  beforeEach(() => {
    jest.spyOn(nanoid, "nanoid").mockImplementation(() => "12345");
  });

  // 1. Generate a random key for the short url AFTER a long url is submitted
  describe("POST /shorten-url", () => {
    test("return a new shorten url", async () => {
      const response = await request.post("/shorten-url").send({ longUrl: "http://test.com" });
      expect(response.statusCode).toBe(200);
      expect(response.body.shortUrl).toMatch(/http:\/\/localhost:4000\/[0-9a-zA-Z]/);
      expect(nanoid.nanoid).toBeCalledTimes(1);
    });
    test("throw an error if a url is not set up", async () => {
      const response = await request.post("/shorten-url").send({});
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("longUrl is necessary");
      expect(nanoid.nanoid).toBeCalledTimes(0);
    });
    test("throw an error if a url does not have http or https", async () => {
      const response = await request.post("/shorten-url").send({ longUrl: "test.com" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("Long URL should start with 'http://' or 'https://'");
      expect(nanoid.nanoid).toBeCalledTimes(0);
    });
    test("throw an error if a generated key is duplicated", async () => {
      await request.post("/shorten-url").send({ longUrl: "http://test.com" });
      expect(nanoid.nanoid).toBeCalledTimes(1);
      const response = await request.post("/shorten-url").send({ longUrl: "http://test.com" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("key is duplicated");
      expect(nanoid.nanoid).toBeCalledTimes(2);
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
      expect(response.text).toBe("the short url is wrong");
    });
  });
});
