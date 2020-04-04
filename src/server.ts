import "dotenv/config";

import { App } from "./app";
import { PomodorosController } from "./pomodoros/controller";

import { AuthenticationController } from "./authentication/controller";

const controllers = [new PomodorosController(), new AuthenticationController()];

const app = new App(controllers);
app.listen(process.env.PORT!);
