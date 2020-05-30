import * as mongoose from "mongoose";
import { Tag } from "./Tag";

const tagSchema = new mongoose.Schema<Tag>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
});

export type MongooseTag = Tag & mongoose.Document;

export const tagModel = mongoose.model<MongooseTag>("tag", tagSchema);
