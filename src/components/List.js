import React from 'react'
import { NavDropdown, MenuItem } from 'react-bootstrap'
const ListAction = ({ title, icon, ...props }) => {
  return (
    <li role='presentation' {...props}>
      <a role='menuitem' tabIndex='-1'>
        <span className={'glyphicon glyphicon-' + icon} />
        {' ' + title}
      </a>
    </li>
  )
}
class List extends React.Component {
  constructor () {
    super()
    this.state = { show: false }
  }
  handleToggle (value) {
    if (this.forceOpen) {
      this.setState({ show: true })
      this.forceOpen = false
      return
    }
    this.setState({ show: value })
  }
  render () {
    const {
      items,
      title,
      selectedId,
      onSelect = () => {},
      actions = []
    } = this.props
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
          <ListAction
            title={action.title}
            key={index}
            icon={action.icon}
            onClick={action.callback}
          />
        )}
      </NavDropdown>
    )
  }
}
export default List
