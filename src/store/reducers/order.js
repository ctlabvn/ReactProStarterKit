const initialState = {
  items: [],
};

export const order = (state = initialState, { type, payload }) => {
  const index = state.items.findIndex(item=>item.item_uuid === payload.item_uuid);
  switch (type) {
    case "order/addItem":      
      return index !== -1 ? state : {...state, items: [...state.items, payload]};
    case "order/removeItem":      
      return index === -1 ? state : {...state, items: [...state.items.slice(index), ...state.items.slice(index+1)]};
    case "order/updateItem":
      return index === -1 ? state : {...state, items: [...state.items.slice(index), payload, ...state.items.slice(index+1)]};
    default:
      return state;
  }
};