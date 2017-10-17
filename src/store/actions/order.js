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

