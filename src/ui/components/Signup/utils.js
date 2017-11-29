import i18n from "~/i18n";
import { validateLogin } from "~/utils";

export const validate = values => {
  const errors = validateLogin(values);
  // first time it is empty
  if (!values.name) errors.name = i18n.t("LABEL.ENTER_FULLNAME");
  if (!values.phone) errors.phone = i18n.t("LABEL.ENTER_PHONE");
  if (!values.address_name) errors.address_name = i18n.t("LABEL.ENTER_NAME");
  if (!values.address) errors.address = i18n.t("LABEL.ENTER_ADDRESS");

  return errors;
};
