import { Request } from "express";
import { ObjectSchema, InferType } from "yup";

export interface ValidatedRequest<T extends ObjectSchema> extends Request {
  body: InferType<T>;
}
