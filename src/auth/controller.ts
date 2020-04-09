import * as bcrypt from "bcrypt";
import * as express from "express";
import { Response, NextFunction, Request } from "express";
import * as passport from "passport";
import * as crypto from "crypto";

import { Controller } from "../types/Controller";
import { userModel } from "../users/model";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
  confirmEmailValidationSchema,
} from "./validation";
import { verificationTokenModel } from "./model";
import { sendMail } from "../mailer";
import { ValidatedRequest } from "../types/express";
import { serializeUser, UserSerialized } from "../users/serialize";

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
    request: ValidatedRequest<typeof registerValidationSchema>,
    response: Response<UserSerialized>,
    next: NextFunction
  ) => {
    const { email, password } = request.body;
    if (await userModel.findOne({ email })) {
      // TODO: make next function typed better
      return next({
        status: 404,
        message: `There is a user with email ${email} registered`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      password: hashedPassword,
    });

    // TODO: add types to mongoose models
    const token = await verificationTokenModel.create({
      userId: user.id,
      value: crypto.randomBytes(16).toString("hex"),
    });

    await sendMail({
      to: user.email,
      subject: "Confirm your account",
      text: `Please confirm your account https://yapa.kozubek.dev/confirm-email/${token.value}`,
    });

    response.send(serializeUser(user));
  };

  private login = async (
    request: ValidatedRequest<typeof loginValidationSchema>,
    response: Response<UserSerialized>,
    next: NextFunction
  ) => {
    passport.authenticate("local", (error, user, info) => {
      request.login(user, (err) => {
        if (!user) {
          return next({
            status: 400,
            message: "Wrong auth data",
          });
        }

        return response.send(serializeUser(user));
      });
    })(request, response, next);
  };

  private confirmEmail = async (
    request: Request,
    response: Response,
    next: NextFunction
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

    if (!user) {
      return next({
        status: 400,
        message: `User assigned to token ${tokenValue} doesn't exist`,
      });
    }

    await verificationTokenModel.findByIdAndDelete(token.id);

    return response.send(serializeUser(user));
  };
}
