// args to invoke service


export const getEvents = (...args) => ({
  type: 'app/getEvents',
  args,
})

export const deleteEvent = (...args) => ({
  type: 'app/deleteEvent',
  args,
})

export const replaceEvents = (data) => ({
  type: 'app/replaceEvents',
  payload: data,
})