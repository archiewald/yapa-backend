import { Request } from "express";
import { ObjectSchema, InferType } from "yup";
import { MongooseUser } from "../users/model";

export interface ValidatedRequest<T extends ObjectSchema> extends Request {
  body: InferType<T>;
}

export type AuthenticatedRequest<T extends Request> = Omit<T, "user"> & {
  user: MongooseUser;
};
