import { REHYDRATE } from "redux-persist/constants";
import shallowEqual from "fbjs/lib/shallowEqual";

export const initialState = {
  items: [],
  history: [],
  info: {}
};

const updateItem = (state, index, payload) => {
  return {
    ...state,
    items: [
      ...state.items.slice(0, index),
      payload,
      ...state.items.slice(index + 1)
    ]
  };
};

const extractOptionValue = option => ({
  uuid: option.option_uuid,
  qty: option.qty || 1
});

const findIndex = (state, payload) =>
  state.items.findIndex(item => item.item_uuid === payload.item_uuid);

const findIndexWithOptions = (state, payload) => {
  // find items with the same options
  return state.items.findIndex(
    item =>
      item.item_uuid === payload.item_uuid &&
      shallowEqual(
        item.item_options.map(extractOptionValue),
        payload.item_options.map(extractOptionValue)
      )
  );
};

export const order = (state = initialState, { type, payload }) => {
  let index = -1;
  switch (type) {
    case "order/clearItems":
      // force update order info belong to restaurant later, or better use other field
      // so we only remain order_address mean current address of user
      // what to be considered to remain?
      return {
        ...state,
        items: [],
        info: {
          // order_address: state.info.order_address
        }
      };
    case "order/addItem":
      index =
        payload.item_options && payload.item_options.length
          ? findIndexWithOptions(state, payload)
          : findIndex(state, payload);
      // we will auto update quantity if this item has no item_options
      return index !== -1
        ? updateItem(state, index, {
            ...state.items[index],
            ...payload,
            quantity: payload.quantity + state.items[index].quantity
          })
        : { ...state, items: [...state.items, payload] };
    case "order/removeItem":
      index = findIndex(state, payload);
      return index === -1
        ? state
        : {
            ...state,
            items: [
              ...state.items.slice(0, index),
              ...state.items.slice(index + 1)
            ]
          };
    case "order/updateItem":
      index = findIndex(state, payload);
      return index === -1 ? state : updateItem(state, index, payload);
    case "order/update":
      return { ...state, info: { ...state.info, ...payload } };
    case "order/updateHistory":
      return { ...state, history: payload };
    case REHYDRATE:
      // save reject token do nothing
      const incoming = payload.order;
      if (incoming) {
        console.log("Updated order for all!!!", incoming);
        // even return the whole payload, redux still does not update the left parts
        // and transform help to convert between two sides
        return { ...state, ...incoming };
      }
      return state;
    default:
      return state;
  }
};
