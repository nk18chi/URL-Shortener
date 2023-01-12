import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { randomBytes } from "node:crypto";

const app = express();
const port = 4000;
const domain = `http://localhost:${port}`;

app.use(cors());
app.use(express.json());

// shorten URL => actual URL
const shortURLs: { [key: string]: string } = {};
const keys = new Set();

app.post("/shorten-url", (res, req, next) => {
  const { url } = res.body || {};
  if (!url) throw new Error("url is necessary");
  if (!/^http(s){0,1}:\/\//.test(url)) throw new Error("URL should start with 'http://' or 'https://'");

  const key = randomBytes(3).toString("hex");
  if (keys.has(key)) throw new Error("key is duplicated");
  keys.add(key);
  shortURLs[key] = url;
  const shortUrl = `${domain}/${key}`;
  req.status(200).send({ shortUrl });
});

app.get("/:id", (res, req) => {
  const url = shortURLs[res.params.id];
  if (!url) throw new Error("the short url is not corrct");
  req.redirect(url);
});

const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  const status = err.status || 404;
  res.status(status).send(err.message);
};

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Short URL app listening on port ${port}`));
}

export default app;
