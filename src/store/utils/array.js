export const chunk = (array, size) => {
  const ret = [];
  for (var i = 0; i < array.length; i += size) {
    ret.push(array.slice(i, size + i));
  }
  return ret;
};
