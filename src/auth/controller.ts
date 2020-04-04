import * as bcrypt from "bcrypt";
import * as express from "express";
import * as passport from "passport";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";

import { Controller } from "../types/Controller";
import { userModel } from "../users/model";
import { User } from "../users/User";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { registerValidationSchema, loginValidationSchema } from "./validation";
import { verificationTokenModel } from "./model";

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

    // TODO: add types to mongoose models
    const token = await verificationTokenModel.create({
      userId: user.id,
      value: crypto.randomBytes(16).toString("hex"),
    });

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: '"🍅 Yet Another Pomodoro App" <yapa@kozubek.dev>', // sender address
      to: user.email, // list of receivers
      subject: "Confirm your account", // Subject line
      text: `Please confirm your account https://yapa.kozubek.dev/confirm-email/${token.value}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

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
}
