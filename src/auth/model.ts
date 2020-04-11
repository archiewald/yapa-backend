import * as mongoose from "mongoose";
import { string } from "yup";
import { VerificationToken } from "./VerificationToken";

const verificationTokenSchema = new mongoose.Schema<VerificationToken>({
  userId: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24,
    default: Date.now,
  },
});

export const verificationTokenModel = mongoose.model<
  VerificationToken & mongoose.Document
>("verificationToken", verificationTokenSchema);
