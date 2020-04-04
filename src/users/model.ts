import * as mongoose from "mongoose";
import { User } from "./User";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: { type: Boolean, default: false },
});

export const userModel = mongoose.model<User & mongoose.Document>(
  "User",
  userSchema
);
