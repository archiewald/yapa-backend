import { Response, Request } from "express";
import * as express from "express";

import { Controller } from "../types/Controller";
import { UserSerialized, serializeUser } from "./serialize";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { ValidatedRequest } from "../types/express";
import { setSettingsValidationSchema } from "./validation";
import { userModel } from "./model";
import { User } from "./User";

export class UsersController implements Controller {
  public router = express.Router();
  public path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getUser);
    this.router.put(`${this.path}/settings`, this.updateSettings);
  }

  private getUser = async (
    request: Request,
    response: Response<UserSerialized | null>
  ) => {
    const { user } = request;

    return response.send(user ? serializeUser(user as any) : null);
  };

  private updateSettings = async (
    request: ValidatedRequest<typeof setSettingsValidationSchema>,
    response: Response<UserSerialized>
  ) => {
    const { user: passportUser } = request;
    const settings = request.body;

    const user = await userModel.findByIdAndUpdate(
      (passportUser as User).id,
      settings
    );
    return response.send(serializeUser(user!));
  };
}
