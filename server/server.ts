import express, { Express, ErrorRequestHandler } from "express";
import cors from "cors";
import { ShortURL } from "./routes/short-url-1";
// import { ShortURL } from "./routes/short-url-2";

interface IApp {
  express: Express;
  start: () => void;
}

export interface IRoute {
  initialize: () => void;
  methods: (express: Express) => void;
}

export class App implements IApp {
  express = express();
  private static port = process.env.PORT;
  private routes: IRoute[] = [new ShortURL()];

  start() {
    this.express.use(cors());
    this.express.use(express.json());

    this.routes.map((route) => route.methods(this.express));

    const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
      const status = err.status || 404;
      res.status(status).send(err.message);
    };
    this.express.use(errorHandler);

    if (process.env.NODE_ENV !== "test") {
      this.express.listen(App.port, () => console.log(`Short URL app listening on port ${App.port}`));
    }
  }
}
