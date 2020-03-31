import * as mongoose from "mongoose";
import { User } from "./User";

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

export const userModel = mongoose.model<User & mongoose.Document>(
  "User",
  userSchema
);
