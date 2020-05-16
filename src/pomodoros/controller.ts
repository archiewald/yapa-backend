import * as express from "express";
import { Response, Request } from "express";

import { Controller } from "../types/Controller";
import { pomodoroModel } from "./model";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { createPomodoroValidationSchema } from "./validation";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ValidatedRequest } from "../types/express";
import { MongooseUser } from "../users/model";
import { PomodoroSerialized, serializePomodoro } from "./serialize";

export class PomodorosController implements Controller {
  public path = "/pomodoros";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(createPomodoroValidationSchema),
      this.create
    );
  }

  getAll = async (
    request: Request,
    response: Response<PomodoroSerialized[]>
  ) => {
    const { user } = request;

    const pomodoros = await pomodoroModel.find({
      userId: (user as MongooseUser).id,
    });
    response.send(pomodoros.map((pomodoro) => serializePomodoro(pomodoro)));
  };

  create = async (
    request: ValidatedRequest<typeof createPomodoroValidationSchema>,
    response: Response<PomodoroSerialized>
  ) => {
    const { user } = request;
    const pomodoroData = request.body;

    const pomodoro = await pomodoroModel.create({
      ...pomodoroData,
      userId: (user as MongooseUser).id,
    });

    response.send(serializePomodoro(pomodoro));
  };
}
