const renameItem = (itemType, id, newName) => {
  return {
    type: 'EDIT_' + itemType,
    payload: { id, edited: { name: newName } }
  }
}
export default renameItem
