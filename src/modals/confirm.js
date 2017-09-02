import React from "react";
import {
  Modal,
  FormControl,
  FormGroup,
  ControlLabel,
  Button
} from "react-bootstrap";
import { connect } from "react-redux";
import _ from "underscore";
import { closeModal } from "../actions";
class Prompt extends React.Component {
  ok() {
    const { onFinish } = this.props;
    
  }
  cancel() {
    const { onFinish } = this.props;
  }
  render() {
    const { title, content, dispatch } = this.props;
    return (
      <div>
        <Modal.Header>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body />

        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => this.ok()}>
            OK
          </Button>
          <Button onClick={() => this.cancel()}>Cancel</Button>
        </Modal.Footer>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return { dispatch };
};
export default connect(undefined, mapDispatchToProps)(Prompt);
