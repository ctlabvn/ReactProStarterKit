
export const eventReducer = (state = {}, { type, payload }) => {
  switch (type) {    
    case 'app/replaceEvents':
      return payload
    default:
      return state
  }

}

