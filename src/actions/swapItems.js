const swapItems = (itemType, firstId, secondId) => {
  return {
    type: "SWAP_" + itemType,
    payload: { firstId, secondId }
  };
};
export default swapItems;
