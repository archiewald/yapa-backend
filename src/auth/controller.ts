import * as bcrypt from "bcrypt";
import * as express from "express";
import { Response, NextFunction, Request } from "express";
import * as passport from "passport";
import * as crypto from "crypto";

import { Controller } from "../types/Controller";
import { userModel, MongooseUser } from "../users/model";
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
import { HttpException } from "../exceptions/HttpException";

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
    this.router.post(`${this.path}/logout`, this.logout);
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
      return next(
        new HttpException(400, `There is a user with email ${email} registered`)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      password: hashedPassword,
    });

    const token = await verificationTokenModel.create({
      userId: user.id,
      value: crypto.randomBytes(16).toString("hex"),
    });

    await sendMail({
      to: user.email,
      subject: "🍅 Confirm your account",
      text: `Please confirm your account ${process.env.FRONTEND_URL}/confirm-email/${token.value}`,
    });

    sendMail({
      to: "artur.kozubek1@gmail.com",
      subject: `${user.email} set up an account`,
    });

    response.send(serializeUser(user));
  };

  private login = async (
    request: ValidatedRequest<typeof loginValidationSchema>,
    response: Response<UserSerialized>,
    next: NextFunction
  ) => {
    // TODO: handle errors
    passport.authenticate("local", (error, user, info) => {
      request.login(user, (err) => {
        if (!user) {
          return next(new HttpException(400, "Wrong auth data"));
        }

        return response.send(serializeUser(user));
      });
    })(request, response, next);
  };

  private logout = async (request: Request, response: Response) => {
    request.session?.destroy(() => {
      response.clearCookie("connect.sid");
      response.sendStatus(200);
    });
  };

  private confirmEmail = async (
    request: ValidatedRequest<typeof confirmEmailValidationSchema>,
    response: Response<UserSerialized>,
    next: NextFunction
  ) => {
    const { token: tokenValue } = request.body;

    const token = await verificationTokenModel.findOne({ value: tokenValue });

    if (!token) {
      return next(
        new HttpException(400, `There is no token with value ${tokenValue}`)
      );
    }

    const user = await userModel.findByIdAndUpdate(token.userId, {
      verified: true,
    });

    if (!user) {
      return next(
        new HttpException(
          400,
          `User assigned to token ${tokenValue} doesn't exist`
        )
      );
    }

    await verificationTokenModel.findByIdAndDelete(token.id);

    return response.send(serializeUser(user));
  };
}
