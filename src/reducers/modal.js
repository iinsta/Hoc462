const modalReducer = (
  state = {
    currentModal: null,
    open: false
  },
  action
) => {
  const { type, payload = {} } = action
  const { open = false, modalType = state.currentModal, props = {} } = payload
  switch (type) {
    case 'MODAL':
      return { currentModal: modalType, props, open }
    default:
      return state
  }
}
export default modalReducer
