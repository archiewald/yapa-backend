import * as bodyParser from "body-parser";
import "dotenv/config";

import App from "./app";
import PomodorosController from "./pomodoros/controller";
import loggerMiddleware from "./middlewares/logger";

const middlewares = [loggerMiddleware, bodyParser.json()];
const controllers = [new PomodorosController()];

const app = new App(middlewares, controllers);

app.listen(5000);
