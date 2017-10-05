// payload to replace store
export const replaceUser = (data) => ({
  type: 'app/replaceUser',
  payload: data,
})

export const replaceUsers = (data) => ({
  type: 'app/replaceUsers',
  payload: data,
})