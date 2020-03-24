import * as mongoose from "mongoose";
import { Pomodoro } from "./Pomodoro";

const pomodoroSchema = new mongoose.Schema<Pomodoro>({
  userId: String,
  startDate: String,
  duration: Number
});

const pomodoroModel = mongoose.model<Pomodoro & mongoose.Document>(
  "Pomodoro",
  pomodoroSchema
);

export default pomodoroModel;
