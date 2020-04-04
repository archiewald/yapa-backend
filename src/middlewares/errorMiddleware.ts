import { NextFunction, Request, Response } from "express";

interface HttpException {
  status: number;
  message: string;
}

export function errorMiddleware(
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    message,
  });
}
