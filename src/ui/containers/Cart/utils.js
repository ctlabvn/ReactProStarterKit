import { ORDER_TYPE } from "~/utils";

export const validate = values => {
  const errors = {};
  // first time it is empty
  if (!values) return errors;

  return errors;
};

export const getOrderTypeValue = (value, orderTypes) => {
  return orderTypes.length === 1
    ? orderTypes[0].id
    : value || ORDER_TYPE.DELIVERY;
};
