import * as bodyParser from "body-parser";
import * as cors from "cors";
import "dotenv/config";

import { App } from "./app";
import { PomodorosController } from "./pomodoros/controller";
import { loggerMiddleware } from "./middlewares/logger";
import * as session from "express-session";

const middlewares = [
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30
      //   secure: true
    }
  }),
  loggerMiddleware,
  bodyParser.json(),
  cors()
];
const controllers = [new PomodorosController()];

const app = new App(middlewares, controllers);
app.listen(process.env.PORT!);
