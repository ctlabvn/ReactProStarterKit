import i18n from "~/i18n";

export const validate = values => {
  const errors = {};
  // first time it is empty
  if (!values) return errors;
  if (!values.name) errors.name = i18n.t("LABEL.ENTER_FULLNAME");
  if (!values.phone) errors.phone = i18n.t("LABEL.ENTER_PHONE");
  const addressErrors = [];
  values.address.forEach((item, index) => {
    const itemError = {};
    if (!item.name) {
      itemError.name = i18n.t("LABEL.ENTER_NAME");
      addressErrors[index] = itemError;
    }
    if (!item.address) {
      itemError.address = i18n.t("LABEL.ENTER_ADDRESS");
      addressErrors[index] = itemError;
    }
  });

  addressErrors.length && (errors.address = addressErrors);

  return errors;
};
