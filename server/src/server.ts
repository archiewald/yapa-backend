import * as bodyParser from "body-parser";

import App from "./app";
import PomodorosController from "./pomodoros/controller";
import loggerMiddleware from "./middlewares/logger";

const app = new App(
  [loggerMiddleware, bodyParser.json()],
  [new PomodorosController()]
);

app.listen(5000);
