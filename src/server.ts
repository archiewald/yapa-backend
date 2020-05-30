import "dotenv/config";

import { App } from "./app";
import { PomodorosController } from "./pomodoros/controller";

import { AuthenticationController } from "./auth/controller";
import { UsersController } from "./users/controller";
import { TagsController } from "./tags/controller";

const controllers = [
  new PomodorosController(),
  new AuthenticationController(),
  new UsersController(),
  new TagsController(),
];

const app = new App(controllers);
app.listen(process.env.PORT!);
