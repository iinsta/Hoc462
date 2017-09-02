const modalReducer = (
  state = {
    currentModal: null,
    open: false
  },
  action
) => {
  const { type, payload = {} } = action;
  const { open = false, modalType = state.currentModal } = payload;
  switch (type) {
    case "MODAL":
      return { currentModal: modalType, open };
      break;
  }
  return state;
};
export default modalReducer;
