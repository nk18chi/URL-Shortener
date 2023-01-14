import { Express } from "express";
import { randomBytes } from "node:crypto";
import { IRoute } from "../server";

// 1. Generate a random key for the short url AFTER a long url is submitted
export class ShortURL implements IRoute {
  private shortURLs: { [key: string]: string } = {}; // shorten URL => actual URL
  private keySet: Set<string> = new Set();
  private static domain = process.env.DOMAIN;

  initialize() {
    this.shortURLs = {};
    this.keySet = new Set();
  }

  methods(express: Express) {
    this.initialize();
    express.post("/shorten-url", (res, req) => {
      const { url } = res.body || {};
      if (!url) throw new Error("url is necessary");
      if (!/^http(s){0,1}:\/\//.test(url)) throw new Error("URL should start with 'http://' or 'https://'");
      const key = randomBytes(3).toString("hex");
      if (this.keySet.has(key)) throw new Error("key is duplicated");
      this.keySet.add(key);
      this.shortURLs[key] = url;
      const shortUrl = `${ShortURL.domain}/${key}`;
      req.status(200).send({ shortUrl });
    });

    express.get("/:id", (res, req) => {
      const url = this.shortURLs[res.params.id];
      if (!url) throw new Error("the short url is not corrct");
      req.redirect(url);
    });
  }
}
