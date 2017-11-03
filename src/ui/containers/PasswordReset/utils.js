import { isValidEmail } from "~/ui/utils";


export const validate = (values) => {
  const errors = isValidEmail(values);

  return errors
};