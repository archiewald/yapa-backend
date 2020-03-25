import * as express from "express";
import { Pomodoro } from "./Pomodoro";
import { Controller } from "../types/Controller";
import pomodoroModel from "./model";

class PomodorosController implements Controller {
  public path = "/pomodoros";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAll);
    this.router.post(this.path, this.create);
  }

  getAll: express.Handler = async (_request, response) => {
    const pomodoros = await pomodoroModel.find();
    response.send(pomodoros);
  };

  create: express.Handler = async (request, response) => {
    const pomodoro: Pomodoro = request.body;
    await new pomodoroModel(pomodoro).save();
    response.send(pomodoro);
  };
}

export default PomodorosController;
