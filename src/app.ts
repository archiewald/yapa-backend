import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { Controller } from "./types/Controller";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { userModel } from "./users/model";
import { loggerMiddleware } from "./middlewares/logger";
import { sessionMiddleware } from "./middlewares/sessionMiddleware";

export class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();

    this.app.use(sessionMiddleware());
    this.app.use(loggerMiddleware);
    this.app.use(bodyParser.json());
    this.app.use(cors());

    // configure passport.js to use the local strategy
    passport.use(
      new passportLocal.Strategy(
        { usernameField: "email" },
        async (email, password, done) => {
          const user = await userModel.findOne({ email });

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        }
      )
    );

    // tell passport how to serialize the user
    passport.serializeUser((user: any, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.initializeControllers(controllers);

    this.app.use(errorMiddleware);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_URL } = process.env;

    mongoose.connect(MONGO_URL!, {
      useNewUrlParser: true
    });
  }
}
