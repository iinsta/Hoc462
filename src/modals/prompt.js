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
  constructor() {
    super();
    this.inputControlId = _.uniqueId("id_");
    this.state = { validationState: null };
  }
  submit() {
    const { dispatch, done } = this.props;
    const text = document.querySelector("#" + this.inputControlId).value;
    if (text === "") {
      this.setState({ validationState: "error" });
    } else {
      this.setState({ validationState: "success" });
      done(text);
      dispatch(closeModal());
    }
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

        <Modal.Body>
          <form
            ref={element => (this.form = element)}
            onSubmit={e => e.preventDefault()}
          >
            <FormGroup
              controlId={this.inputControlId}
              validationState={this.state.validationState}
            >
              <ControlLabel>
                {content}
              </ControlLabel>
              <FormControl type="text" />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => this.submit()}>
            OK
          </Button>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
        </Modal.Footer>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return { dispatch };
};
export default connect(undefined, mapDispatchToProps)(Prompt);
