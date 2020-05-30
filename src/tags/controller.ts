import * as express from "express";
import { Response, Request } from "express";

import { Controller } from "../types/Controller";
import { tagModel } from "./model";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { createTagValidationSchema } from "./validation";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ValidatedRequest } from "../types/express";
import { MongooseUser } from "../users/model";
import { TagSerialized, serializeTag } from "./serialize";

export class TagsController implements Controller {
  public path = "/tags";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAll);
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(createTagValidationSchema),
      this.create
    );
  }

  getAll = async (request: Request, response: Response<TagSerialized[]>) => {
    const { user } = request;

    const tags = await tagModel.find({
      userId: (user as MongooseUser).id,
    });

    response.send(tags.map((tag) => serializeTag(tag)));
  };

  create = async (
    request: ValidatedRequest<typeof createTagValidationSchema>,
    response: Response<TagSerialized>
  ) => {
    const { user } = request;
    const tagData = request.body;

    const tag = await tagModel.create({
      ...tagData,
      userId: (user as MongooseUser).id,
    });

    response.send(serializeTag(tag));
  };
}
