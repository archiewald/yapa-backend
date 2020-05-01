import * as bcrypt from "bcrypt";
import * as express from "express";
import * as passport from "passport";
import * as passportLocal from "passport-local";

import { userModel } from "./users/model";

export function initPassport(app: express.Application) {
  // configure passport.js to use the local strategy
  passport.use(
    new passportLocal.Strategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await userModel.findOne({ email });

        if (!user || !user.verified) {
          return done(null, false);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return done(null, isPasswordValid ? user : false);
      }
    )
  );

  // tell passport how to serialize the user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
}
