export const setRestaurant = (data) => ({
  type: 'order/setRestaurant',
  payload:data,
});

export const updateOrder = (data) => ({
  type: 'order/update',
  payload: data,
});

export const updateOrderHistory = (data) => ({
  type: 'order/updateHistory',
  payload: data,
});

export const addOrderItem = (data) => ({
  type: 'order/addItem',
  payload: data,
});

export const removeOrderItem = (data) => ({
  type: 'order/removeItem',
  payload: data,
});

export const updateOrderItem = (data) => ({
  type: 'order/updateItem',
  payload: data,
});

