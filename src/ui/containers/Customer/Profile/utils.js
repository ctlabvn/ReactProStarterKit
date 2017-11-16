export const validate = (values) => {
  const errors = {}
  // first time it is empty
  if(!values) return errors
  if (!values.name) errors.name = 'Enter fullname'
  if (!values.phone) errors.phone = 'Enter phone';
  const addressErrors = [];
  values.address.forEach((item, index)=>{
    const itemError = {}
    if(!item.name) {
      itemError.name = 'Enter name';
      addressErrors[index] = itemError;
    }
    if(!item.address) {
      itemError.address = 'Enter address';
      addressErrors[index] = itemError;
    }
  });

  addressErrors.length && (errors.address = addressErrors);

  return errors;
}