import * as bcrypt from "bcrypt";
import * as express from "express";
import * as passport from "passport";

import { Controller } from "../types/Controller";
import { userModel } from "../users/model";
import { User } from "../users/User";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { registerValidationSchema, loginValidationSchema } from "./validation";

export class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(registerValidationSchema),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(loginValidationSchema),
      this.login
    );
  }

  private register = async (
    request: express.Request,
    response: express.Response<Omit<User, "password">>,
    next: express.NextFunction
  ) => {
    // TODO: validate user data
    const userData = request.body;
    if (await userModel.findOne({ email: userData.email })) {
      // TODO: make next function typed better
      return next({
        status: 404,
        message: `There is a user with email ${userData.email} registered`,
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userModel.create({
      ...userData,
      password: hashedPassword,
    });
    response.send({ email: user.email, id: user.id });
  };

  private login = async (
    request: express.Request,
    response: express.Response<Omit<User, "password">>,
    next: express.NextFunction
  ) => {
    passport.authenticate("local", (error, user, info) => {
      request.login(user, (err) => {
        if (!user) {
          return next({
            status: 400,
            message: "Wrong auth data",
          });
        }

        return response.send({
          email: user.email,
          id: user.id,
        });
      });
    })(request, response, next);
  };
}
