import * as express from "express";

import { Controller } from "types/controller";

class App {
  public app: express.Application;

  constructor(middlewares: express.Handler[], controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares(middlewares);
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares(middlewares: express.Handler[]) {
    middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }
}

export default App;
