import * as bodyParser from "body-parser";
import * as cors from "cors";
import "dotenv/config";

import { App } from "./app";
import { PomodorosController } from "./pomodoros/controller";
import { loggerMiddleware } from "./middlewares/logger";

const middlewares = [loggerMiddleware, bodyParser.json(), cors()];
const controllers = [new PomodorosController()];

const app = new App(middlewares, controllers);

app.listen(process.env.PORT!);
