import * as express from "express";

export function fakeLoggerMiddleware(
  _request: express.Request,
  _response: express.Response,
  next: express.NextFunction
) {
  next();
}
