import * as express from "express";
import { Pomodoro } from "./Pomodoro";
import { Controller } from "types/controller";

class PomodorosController implements Controller {
  public path = "/pomodoros";
  public router = express.Router();

  private pomodoros: Pomodoro[] = [
    {
      id: "x",
      userId: "y",
      startDate: "2020-03-22T09:44:31Z",
      duration: 1000 * 60 * 20
    }
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPomodoros);
    this.router.post(this.path, this.createAPomodoro);
  }

  getAllPomodoros: express.Handler = (_request, response) => {
    response.send(this.pomodoros);
  };

  createAPomodoro: express.Handler = (request, response) => {
    const pomodoro: Pomodoro = request.body;
    this.pomodoros.push(pomodoro);
    response.send(pomodoro);
  };
}

export default PomodorosController;
