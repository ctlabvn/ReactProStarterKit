const initialState = {
  items: [],
};

const updateItem = (state, index, payload)=>{
  return {...state, items: [...state.items.slice(0, index), payload, ...state.items.slice(index+1)]}
}

export const order = (state = initialState, { type, payload }) => {
  const index = state.items.findIndex(item=>item.item_uuid === payload.item_uuid);
  switch (type) {
    case "order/addItem":      
      return index !== -1 ? updateItem(state, index, {...state.items[index], ...payload, quantity: payload.quantity+state.items[index].quantity}) : {...state, items: [...state.items, payload]};
    case "order/removeItem":      
      return index === -1 ? state : {...state, items: [...state.items.slice(0, index), ...state.items.slice(index+1)]};
    case "order/updateItem":
      return index === -1 ? state : updateItem(state, index, payload);
    default:
      return state;
  }
};