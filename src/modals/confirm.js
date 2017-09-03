import React from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { closeModal } from "../actions";
class Confirm extends React.Component {
  done(flag) {
    const { onFinish, dispatch } = this.props;
    onFinish(flag);
    dispatch(closeModal());
  }
  render() {
    const { title, content } = this.props;
    return (
      <div>
        <Modal.Header>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {content}
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => this.done(true)}>
            OK
          </Button>
          <Button onClick={() => this.done(false)}>Cancel</Button>
        </Modal.Footer>
      </div>
    );
  }
}
export default connect()(Confirm);
