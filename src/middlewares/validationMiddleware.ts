import * as express from "express";
import * as Yup from "yup";

import { HttpException } from "../exceptions/HttpException";

export function validationMiddleware(
  schema: Yup.ObjectSchema
): express.RequestHandler {
  return (request, _response, next) => {
    schema
      .validate(request.body, { abortEarly: false })
      .then(() => next())
      .catch((validationError: Yup.ValidationError) =>
        next(new HttpException(400, validationError.errors.join(", ")))
      );
  };
}
