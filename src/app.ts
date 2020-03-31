import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as passportLocal from "passport-local";

import { Controller } from "./types/Controller";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { userModel } from "./users/model";

export class App {
  public app: express.Application;

  constructor(middlewares: express.Handler[], controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares(middlewares);

    // configure passport.js to use the local strategy
    passport.use(
      new passportLocal.Strategy(
        { usernameField: "email" },
        async (email, password, done) => {
          debugger;
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
      debugger;
      done(null, user?.id);
    });

    passport.deserializeUser(async (id, done) => {
      debugger;
      const user = await userModel.findOne({ id });
      done(null, user);
    });

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.connectToTheDatabase();
    this.initializeControllers(controllers);

    this.app.use(errorMiddleware);
  }

  public listen(port: string) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

  private initializeMiddlewares(middlewares: express.Handler[]) {
    middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_URL } = process.env;

    mongoose.connect(MONGO_URL!, { useNewUrlParser: true });
  }
}
