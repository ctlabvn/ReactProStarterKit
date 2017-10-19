import { validateLogin } from "~/ui/utils";

export const validate = (values) => {
  const errors = validateLogin(values);
  // first time it is empty  
  if (!values.name) errors.name = 'Enter fullname'
  if (!values.address_name) errors.address_name = 'Enter address name (such as home)'
  if (!values.address) errors.address = 'Enter address'

  return errors
}