import { Express } from "express";
import { nanoid } from "nanoid";
import { IRoute } from "../server";

// 1. Generate a random key for the short url AFTER a long url is submitted
export class ShortURL implements IRoute {
  private shortURLs: { [key: string]: string }; // short URL => long URL
  private keySet: Set<string>;
  private static domain: string;

  constructor() {
    this.shortURLs = {};
    this.keySet = new Set();
    ShortURL.domain = process.env.DOMAIN ? process.env.DOMAIN : "";
  }

  initialize() {
    this.shortURLs = {};
    this.keySet = new Set();
  }

  methods(express: Express) {
    this.initialize();
    express.post("/shorten-url", (res, req) => {
      const { longUrl } = res.body || {};
      if (!longUrl) throw new Error("longUrl is necessary");
      if (!/^http(s){0,1}:\/\//.test(longUrl)) throw new Error("Long URL should start with 'http://' or 'https://'");
      const key = nanoid(5);
      if (this.keySet.has(key)) throw new Error("key is duplicated");
      this.keySet.add(key);
      this.shortURLs[key] = longUrl;
      const shortUrl = `${ShortURL.domain}/${key}`;
      req.status(200).send({ shortUrl });
    });

    express.get("/:id", (res, req) => {
      const longUrl = this.shortURLs[res.params.id];
      if (!longUrl) throw new Error("the short url is wrong");
      req.redirect(longUrl);
    });
  }
}
