import * as mongoose from "mongoose";
import { Pomodoro } from "./Pomodoro";

const pomodoroSchema = new mongoose.Schema<Pomodoro>({
  userId: { type: String, required: true },
  startDate: { type: String, required: true },
  duration: { type: Number, required: true },
});

export const pomodoroModel = mongoose.model<Pomodoro & mongoose.Document>(
  "pomodoro",
  pomodoroSchema
);
