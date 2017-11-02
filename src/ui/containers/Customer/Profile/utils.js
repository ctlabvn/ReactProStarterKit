export const validate = (values) => {
  const errors = {}
  // first time it is empty
  if(!values) return errors
  // if (!values.email) errors.username = 'Enter email'
  if (!values.phone) errors.phone = 'Enter phone'

  return errors
}