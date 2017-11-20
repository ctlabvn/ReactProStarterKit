import { isValidEmail } from "~/utils";


export const validate = (values) => {
  const errors = isValidEmail(values);

  return errors
};