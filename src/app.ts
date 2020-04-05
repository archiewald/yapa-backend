import * as express from "express";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { Controller } from "./types/Controller";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";
import { initPassport } from "./passport";
import { initMailer } from "./mailer";

export class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();

    this.app.use(sessionMiddleware());
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cors());

    initPassport(this.app);
    initMailer();

    this.initializeControllers(controllers);

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

  private connectToTheDatabase() {
    const { MONGO_URL } = process.env;

    mongoose.connect(MONGO_URL!, {
      useNewUrlParser: true,
    });
  }
}
