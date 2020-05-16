import * as express from "express";
import { Response, Request } from "express";

import { PomodorosController } from "./controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ValidatedRequest } from "../types/express";
import { pomodoroModel } from "./model";

jest.mock("../middlewares/authMiddleware");
jest.mock("./serialize");

const validationMiddlewareHandlerMock = jest.fn();
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

    it("should initialize get pomodoros with authMiddleware, validationMiddleware and create method", () => {
      pomodorosController.initializeRoutes();

      expect(routerPostMock).toBeCalledWith(
        pomodorosController.path,
        authMiddleware,
        validationMiddlewareHandlerMock,
        pomodorosController.create
      );
    });
  });

  describe("create", () => {
    it("should save pomodoro in database", async () => {
      const mockedPomodoroData = {
        date: "MOCKED_DATE",
      };

      const mockedRequest = ({
        user: { id: "MOCKED_ID" },
        body: mockedPomodoroData,
      } as unknown) as Request;

      const sendMock = jest.fn();
      const mockedResponse = ({ send: sendMock } as unknown) as Response<any>;

      await pomodorosController.create(mockedRequest, mockedResponse);

      expect(pomodoroModel.create).toBeCalledWith({
        ...mockedPomodoroData,
        userId: "MOCKED_ID",
      });
    });
  });
});
