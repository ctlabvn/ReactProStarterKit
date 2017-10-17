import { REHYDRATE } from "redux-persist/constants";

const initialState = {
  items: [],
};

const updateItem = (state, index, payload)=>{
  return {...state, items: [...state.items.slice(0, index), payload, ...state.items.slice(index+1)]}
}

export const order = (state = initialState, { type, payload }) => {  
  switch (type) {
    case "order/addItem":
    case "order/removeItem":
    case "order/updateItem":
      const index = state.items.findIndex(item=>item.item_uuid === payload.item_uuid);
    case "order/addItem":      
      return index !== -1 ? updateItem(state, index, {...state.items[index], ...payload, quantity: payload.quantity+state.items[index].quantity}) : {...state, items: [...state.items, payload]};
    case "order/removeItem":    
      return index === -1 ? state : {...state, items: [...state.items.slice(0, index), ...state.items.slice(index+1)]};
    case "order/updateItem":
      return index === -1 ? state : updateItem(state, index, payload);
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