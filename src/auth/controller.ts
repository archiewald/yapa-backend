import * as bcrypt from "bcrypt";
import * as express from "express";
import * as passport from "passport";
import * as crypto from "crypto";

import { Controller } from "../types/Controller";
import { userModel } from "../users/model";
import { User } from "../users/User";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
  confirmEmailValidationSchema,
} from "./validation";
import { verificationTokenModel } from "./model";
import { sendMail } from "../mailer";

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
    this.router.post(
      `${this.path}/confirm-email`,
      validationMiddleware(confirmEmailValidationSchema),
      this.confirmEmail
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

    // TODO: add types to mongoose models
    const token = await verificationTokenModel.create({
      userId: user.id,
      value: crypto.randomBytes(16).toString("hex"),
    });

    await sendMail({
      to: user.email, // list of receivers
      subject: "Confirm your account", // Subject line
      text: `Please confirm your account https://yapa.kozubek.dev/confirm-email/${token.value}`, // plain text body
    });

    response.send({ email: user.email, id: user.id, verified: user.verified });
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
          verified: user.verified,
        });
      });
    })(request, response, next);
  };

  private confirmEmail = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { token: tokenValue } = request.body;

    const token = await verificationTokenModel.findOne({ value: tokenValue });

    if (!token) {
      return next({
        status: 400,
        message: "No such token",
      });
    }

    const user = await userModel.findByIdAndUpdate(token.userId, {
      verified: true,
    });
    await verificationTokenModel.findByIdAndDelete(token.id);

    return response.send(user);
  };
}
