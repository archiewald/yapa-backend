import * as bcrypt from "bcrypt";
import * as express from "express";
import { Controller } from "../types/Controller";
import { userModel } from "../users/model";
import * as passport from "passport";
import { User } from "../users/User";

export class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      //   validationMiddleware(CreateUserDto),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      //   validationMiddleware(LogInDto),
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
      next({
        status: 404,
        message: `There is a user with email ${userData.email} registered`
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userModel.create({
      ...userData,
      password: hashedPassword
    });
    response.send({ email: user.email, id: user.id });
  };

  private login = async (
    request: express.Request,
    response: express.Response<Omit<User, "password">>,
    next: express.NextFunction
  ) => {
    passport.authenticate("local", (error, user, info) => {
      request.login(user, err => {
        console.log({ user, err });
        return response.send({
          email: user.email,
          id: user.id
        });
      });
    })(request, response, next);
  };
}
