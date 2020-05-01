import * as mongoose from "mongoose";
import { Pomodoro } from "./Pomodoro";

const pomodoroSchema = new mongoose.Schema<Pomodoro>({
  userId: { type: String, required: true },
  startDate: { type: String, required: true },
  duration: { type: Number, required: true },
  tags: [{ type: String }],
});

export type MongoosePomodoro = Pomodoro & mongoose.Document;

export const pomodoroModel = mongoose.model<MongoosePomodoro>(
  "pomodoro",
  pomodoroSchema
);
