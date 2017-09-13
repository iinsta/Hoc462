import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import * as modals from '../modals'
const ModalPortal = connect(state => {
  return {
    modal: state.modal.currentModal,
    open: state.modal.open,
    props: state.modal.props
  }
})(({ modal, open, props, dispatch }) => {
  const CurrentModal = modals[modal]
  if (CurrentModal === undefined) {
    return <Modal />
  }
  return (<Modal show={open}>
    <CurrentModal {...props} />
  </Modal>)
})
export default ModalPortal
