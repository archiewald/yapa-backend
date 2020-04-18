import * as mongoose from "mongoose";
import { User } from "./User";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

export type MongooseUser = User & mongoose.Document;

export const userModel = mongoose.model<MongooseUser>("User", userSchema);