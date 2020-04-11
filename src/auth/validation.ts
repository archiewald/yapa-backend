import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const confirmEmailValidationSchema = Yup.object({
  token: Yup.string().required(),
});
