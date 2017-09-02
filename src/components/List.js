import React from "react";
import _ from "underscore";
import {
  NavDropdown,
  MenuItem,
  Modal,
  Radio,
  Button
} from "react-bootstrap";
const ListInMenuAction = ({ title, icon, ...props }) => {
  return (
    <li role="presentation" {...props}>
      <a role="menuitem" tabIndex="-1" href="javascript:void 0">
        <span className={"glyphicon glyphicon-" + icon} />
        {" " + title}
      </a>
    </li>
  );
};
class ListInMenu extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
  }
  handleToggle(value) {
    if (this.forceOpen) {
      this.setState({ show: true });
      this.forceOpen = false;
      return;
    }
    this.setState({ show: value });
  }
  render() {
    const {
      items,
      title,
      selectedId,
      onSelect = () => {},
      actions = []
    } = this.props;
    return (
      <NavDropdown
        open={this.state.show}
        onToggle={val => this.handleToggle(val)}
        title={title}
        id={title}
      >
        {items.map(item =>
          <MenuItem
            onClick={() => (this.forceOpen = true)}
            eventKey={item.id}
            key={item.id}
            active={item.id === selectedId}
            onSelect={onSelect}
          >
            {item.name}
          </MenuItem>
        )}
        {actions.map((action, index) =>
          <ListInMenuAction
            title={action.title}
            key={index}
            icon={action.icon}
            onClick={action.callback}
          />
        )}
      </NavDropdown>
    );
  }
}
class ListInModal extends React.Component {
  constructor() {
    super();
    this.state = { show: false };
  }
  render() {
    const close = () => this.setState({ show: false });
    const { title, items } = this.props;
    const listId =
      this.props.listId !== undefined ? this.props.listId : _.uniqueId();
    return (
      <Modal show={this.state.show}>
        <Modal.Header>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {items.map(item =>
            <Radio eventKey={item.id} key={item.id} name={listId}>
              {item.name}
            </Radio>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary" onClick={close}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export { ListInMenu, ListInModal };
