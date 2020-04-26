import * as yup from "yup";

export const setSettingsValidationSchema = yup.object({
  pomodoro: yup.number().integer().min(0).required(),
  shortBreak: yup.number().integer().min(0).required(),
  longBreak: yup.number().integer().min(0).required(),
});
