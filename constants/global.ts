import { digitRegEx, specialCharsRegEx } from "../utils";

export const minPasswordLength = 8;
export const maxAge = 120;
export const minAge = 18;

export const passwordValidationRules = {
  required: true,
  minLength: {
    value: minPasswordLength,
    message: "Password is too short",
  },
  validate: (value: string) =>
    digitRegEx.test(value) && specialCharsRegEx.test(value),
  maxLength: {
    value: 100,
    message: "The email exceed max length",
  },
};
