import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  return request.isAuthenticated()
    ? next()
    : next({
        status: 401,
        message: "You are not authenticated",
      });
}
