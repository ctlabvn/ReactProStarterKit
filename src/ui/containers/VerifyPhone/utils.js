import i18n from "~/i18n";
import { isValidPhoneNumber } from "~/utils";

export const validate = (values, props, state) => {
  console.log(props, state);
  const errors = {};
  if (!isValidPhoneNumber(values.phone)) {
    errors.phone = i18n.t("LABEL.PHONE_INVALID");
  }
  if (!values.country_code)
    errors.country_code = i18n.t("LABEL.ENTER_COUNTRY_CODE");

  return errors;
};
