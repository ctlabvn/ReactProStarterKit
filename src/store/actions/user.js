// args to invoke service
export const toggleBlockUser = (...args) => ({
  type: 'app/toggleBlockUser',
  args,
})

export const getUser = (...args) => ({
  type: 'app/getUser',
  args,
})

export const notiUser = (...args) => ({
  type: 'app/notiUser',
  args,
})

export const getUsers = (...args) => ({
  type: 'app/getUsers',
  args,
})

export const deleteUser = (...args) => ({
  type: 'app/deleteUser',
  args,
})

export const updateUser = (...args) => ({
  type: 'app/updateUser',
  args,
})


// payload to replace store
export const replaceUser = (data) => ({
  type: 'app/replaceUser',
  payload: data,
})

export const replaceUsers = (data) => ({
  type: 'app/replaceUsers',
  payload: data,
})