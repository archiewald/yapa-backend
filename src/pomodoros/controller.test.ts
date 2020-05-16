import * as express from "express";
import { PomodorosController } from "./controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { createPomodoroValidationSchema } from "./validation";

jest.mock("../middlewares/authMiddleware");

const validationMiddlewareHandlerMock = jest.fn();
// const validationMiddlewareMock = jest.fn(() => validationMiddlewareHandler);
jest.mock("../middlewares/validationMiddleware", () => ({
  validationMiddleware: () => validationMiddlewareHandlerMock,
}));
jest.mock("./validation");

const routerGetMock = jest.fn();
const routerPostMock = jest.fn();

jest.mock("express", () => {
  return {
    Router: jest.fn(() => ({
      get: routerGetMock,
      post: routerPostMock,
    })),
  };
});

describe("PomodorosController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const pomodorosController = new PomodorosController();

  it("should use '/pomodoros' path", () => {
    expect(pomodorosController.path).toBe("/pomodoros");
  });

  describe("routes init", () => {
    it("should initialize get pomodoros with authMiddleware and getAll method", () => {
      pomodorosController.initializeRoutes();

      expect(routerGetMock).toBeCalledWith(
        pomodorosController.path,
        authMiddleware,
        pomodorosController.getAll
      );
    });

    it("should initialize get pomodoros with authMiddleware and create method", () => {
      pomodorosController.initializeRoutes();

      expect(routerPostMock).toBeCalledWith(
        pomodorosController.path,
        authMiddleware,
        validationMiddlewareHandlerMock,
        pomodorosController.create
      );
    });
  });
});
