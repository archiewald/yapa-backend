import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { Controller } from "./types/Controller";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { initPassport } from "./passport";
import { initMailer } from "./mailer";
import { PomodorosController } from "./pomodoros/controller";
import { AuthenticationController } from "./auth/controller";
import { UsersController } from "./users/controller";
import { TagsController } from "./tags/controller";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";

export class Server {
  public app: express.Application;
  private mongoUrl: string;

  constructor(mongoUrl: string) {
    this.app = express();
    this.mongoUrl = mongoUrl;

    this.app.set("trust proxy", 1);
    this.app.use(sessionMiddleware(this.mongoUrl));
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

    initPassport(this.app);
    initMailer();

    this.app.get("/", (_request, response) => response.send("🍅"));
    this.initializeControllers([
      new PomodorosController(),
      new AuthenticationController(),
      new UsersController(),
      new TagsController(),
    ]);

    this.app.use(errorMiddleware);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}
