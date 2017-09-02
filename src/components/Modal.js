import React from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import * as modals from "../modals";
const ModalPortal = connect(state => {
  return {
    modal: state.modal.currentModal,
    open: state.modal.open
  };
})(({ modal, open, dispatch }) => {
  const CurrentModal = modals[modal];
  if (CurrentModal === undefined) {
    return <Modal />;
  }
  return (<Modal show={open}>
    <CurrentModal />
  </Modal>);
});
export default ModalPortal;
