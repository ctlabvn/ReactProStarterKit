export const getSiblings = node => {
  let child = node.parentNode.firstChild;

  const siblings = [];
  for (; child; child = child.nextSibling)
    if (child.nodeType === 1 && child !== node) siblings.push(child);
  return siblings;
};