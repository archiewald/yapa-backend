import * as express from "express";
import * as Yup from "yup";

export function validationMiddleware(
  schema: Yup.ObjectSchema
): express.RequestHandler {
  return (request, response, next) => {
    schema
      .validate(request.body, { abortEarly: false })
      .then(() => next())
      .catch((validationError: Yup.ValidationError) =>
        next({
          status: 400,
          message: validationError.errors.join(", "),
        })
      );
  };
}
