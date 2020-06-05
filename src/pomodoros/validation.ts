import * as Yup from "yup";

export const createPomodoroValidationSchema = Yup.object({
  startDate: Yup.date().required(),
  duration: Yup.number().positive().integer().required(),
  tags: Yup.array(Yup.string()),
});
