import { Response, Request } from "express";
import * as express from "express";

import { Controller } from "../types/Controller";
import { UserSerialized, serializeUser } from "./serialize";
import { ValidatedRequest } from "../types/express";
import { setSettingsValidationSchema } from "./validation";
import { userModel, MongooseUser } from "./model";

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
      (passportUser as MongooseUser).id,
      {
        $set: {
          settings,
        },
      },
      { new: true }
    );
    return response.send(serializeUser(user!));
  };
}
