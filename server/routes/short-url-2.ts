import { Express } from "express";
import { randomBytes } from "node:crypto";
import { IRoute } from "../server";

// 2. Generate random keys BEFOREHAND and assign a key to a long url
export class ShortURL implements IRoute {
  private keys: string[] = [];
  private shortURLs: { [key: string]: string } = {}; // shorten URL => actual URL
  private keySet: Set<string> = new Set();
  private static domain = `http://localhost:4000`;
  private static keySize = 10;

  initialize() {
    this.shortURLs = {};
    this.keySet = new Set();
    while (this.keySet.size < ShortURL.keySize) {
      this.keySet.add(randomBytes(3).toString("hex"));
    }
    this.keys = Array.from(this.keySet);
  }

  methods(express: Express) {
    this.initialize();

    express.post("/shorten-url", (res, req, next) => {
      const { url } = res.body || {};
      if (!url) throw new Error("url is necessary");
      if (!/^http(s){0,1}:\/\//.test(url)) throw new Error("URL should start with 'http://' or 'https://'");

      const key = this.keys.pop();
      if (!key) throw new Error("the unique key ran out");
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
