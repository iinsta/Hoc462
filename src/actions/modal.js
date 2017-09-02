const openModal = modalType => {
  return { type: "MODAL", payload: { modalType, open: true } };
};
const closeModal = () => {
  return { type: "MODAL", payload: { open: false } };
};
export { openModal, closeModal };
