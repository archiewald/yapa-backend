import * as Yup from "yup";

export const createTagValidationSchema = Yup.object({
  name: Yup.string().required(),
});
