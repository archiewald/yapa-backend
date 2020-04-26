import "dotenv/config";

import { App } from "./app";
import { PomodorosController } from "./pomodoros/controller";

import { AuthenticationController } from "./auth/controller";
import { UsersController } from "./users/controller";

const controllers = [
  new PomodorosController(),
  new AuthenticationController(),
  new UsersController(),
];

const app = new App(controllers);
app.listen(process.env.PORT!);
