import openModal from "./modal.js";
const deleteItem = (itemType, id) => {
  return { type: "DELETE_" + itemType, payload: { id } };
};
export default deleteItem;
