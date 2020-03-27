import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as passportLocal from "passport-local";

import { Controller } from "./types/Controller";

export class App {
  public app: express.Application;

  constructor(middlewares: express.Handler[], controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares(middlewares);
    this.initializeControllers(controllers);

    const users = [
      { id: "2f24vvg", email: "test@test.com", password: "password" }
    ];

    // configure passport.js to use the local strategy
    passport.use(
      new passportLocal.Strategy(
        { usernameField: "email" },
        (email, password, done) => {
          console.log("Inside local strategy callback");
          // here is where you make a call to the database
          // to find the user based on their username or email address
          // for now, we'll just pretend we found that it was users[0]
          const user = users[0];
          if (email === user.email && password === user.password) {
            console.log("Local strategy returned true");
            return done(null, user);
          }
        }
      )
    );

    // tell passport how to serialize the user
    passport.serializeUser((user: any, done) => {
      console.log(
        "Inside serializeUser callback. User id is save to the session file store here"
      );
      done(null, user.id);
    });

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // create the login get and post routes
    this.app.get("/login", (req, res) => {
      console.log("Inside GET /login callback function");
      console.log(req.sessionID);
      res.send(`You got the login page!\n`);
    });

    this.app.post("/login", (req, res, next) => {
      console.log("Inside POST /login callback");
      passport.authenticate("local", (err, user, info) => {
        console.log("Inside passport.authenticate() callback");
        console.log(
          `req.session.passport: ${JSON.stringify(req.session?.passport)}`
        );
        console.log(`req.user: ${JSON.stringify(req.user)}`);
        req.login(user, err => {
          console.log("Inside req.login() callback");
          console.log(
            `req.session.passport: ${JSON.stringify(req.session?.passport)}`
          );
          console.log(`req.user: ${JSON.stringify(req.user)}`);
          return res.send("You were authenticated & logged in!\n");
        });
      })(req, res, next);
    });
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
