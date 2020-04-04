import * as Yup from "yup";

export const createPomodoroValidationSchema = Yup.object({
  userId: Yup.string().required(),
  startDate: Yup.date().required(),
  duration: Yup.number().positive().integer().required(),
});
