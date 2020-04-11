import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

export function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  return request.isAuthenticated()
    ? next()
    : next(new HttpException(401, "You are not authenticated"));
}
