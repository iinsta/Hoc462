const openModal = (modalType, props = {}) => {
  return { type: "MODAL", payload: { modalType, props, open: true } };
};
const closeModal = () => {
  return { type: "MODAL", payload: { open: false } };
};
export { openModal, closeModal };
