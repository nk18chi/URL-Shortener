import { Express } from "express";
import { nanoid } from "nanoid";
import { IRoute } from "../server";

// 2. Generate random keys BEFOREHAND and assign a key to a long url
export class ShortURL implements IRoute {
  private keys: string[];
  private shortURLs: { [key: string]: string }; // short URL => long URL
  private keySet: Set<string>;
  private static domain: string;
  private static keySize = 10;

  constructor() {
    this.keys = [];
    this.shortURLs = {};
    this.keySet = new Set();
    ShortURL.domain = process.env.DOMAIN ? process.env.DOMAIN : "";
  }

  initialize() {
    this.shortURLs = {};
    this.keySet = new Set();
    while (this.keySet.size < ShortURL.keySize) {
      this.keySet.add(nanoid(5));
    }
    this.keys = Array.from(this.keySet);
  }

  methods(express: Express) {
    this.initialize();

    express.post("/shorten-url", (res, req) => {
      const { longUrl } = res.body || {};
      if (!longUrl) throw new Error("longUrl is necessary");
      if (!/^http(s){0,1}:\/\//.test(longUrl)) throw new Error("Long URL should start with 'http://' or 'https://'");

      const key = this.keys.pop();
      if (!key) throw new Error("the unique key ran out");
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
