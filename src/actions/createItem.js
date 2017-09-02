const createItem = (itemType, name, id, data) => {
  return { type: "ADD_" + itemType, payload: { name, id, ...data } };
};
export default createItem;
