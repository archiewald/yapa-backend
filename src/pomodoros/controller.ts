import * as express from "express";
import { Pomodoro } from "./Pomodoro";
import { Controller } from "../types/Controller";
import { pomodoroModel } from "./model";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { createPomodoroValidationSchema } from "./validation";

export class PomodorosController implements Controller {
  public path = "/pomodoros";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(
      this.path,
      validationMiddleware(createPomodoroValidationSchema),
      this.create
    );
  }

  getAll: express.Handler = async (request, response) => {
    if (request.isAuthenticated()) {
      const pomodoros = await pomodoroModel.find();
      response.send(pomodoros);
    } else {
      response.sendStatus(401);
    }
  };

  create: express.Handler = async (request, response) => {
    const pomodoro: Pomodoro = request.body;
    await new pomodoroModel(pomodoro).save();
    response.send(pomodoro);
  };
}
