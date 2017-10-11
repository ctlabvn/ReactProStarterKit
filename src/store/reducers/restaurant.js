const initialState = {
  data: [],
};

export const restaurant = (state = initialState, { type, payload }) => {
  switch (type) {
    case "restaurant/saveRestaurants":
      return payload.data;
    default:
      return state;
  }
};