const selectItem = (itemType, id) => {
  return { type: 'SELECT_' + itemType, payload: { id } }
}
export default selectItem
