import React from 'react'
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Modal,
  Button
} from 'react-bootstrap'
import _ from 'underscore'
import { connect } from 'react-redux'
import { closeModal, createItem } from '../actions'
class AddSlide extends React.Component {
  constructor () {
    super()
    this.state = {
      slideNameValidationState: null,
      worldIdValidationState: null,
      worldNameValidationState: null,
      createNewWorld: false
    }
    this.slideNameInputControlId = _.uniqueId('id_')
    this.worldIdInputControlId = _.uniqueId('id_')
    this.worldNameInputControlId = _.uniqueId('id_')
  }
  addSlide () {
    const { dispatch } = this.props
    const formData = new window.FormData(this.form)
    const slideName = formData.get('slideName')
    const worldId = formData.get('worldId')
    const worldName = formData.get('worldName')
    const validationState = {}
    validationState.slideNameValidationState = slideName === ''
      ? 'error'
      : 'success'
    validationState.worldIdValidationState = worldId === 'EMPTY'
      ? 'error'
      : 'success'
    validationState.worldNameValidationState = worldName === ''
      ? 'error'
      : 'success'
    const validationSuccess = Object
      .values(validationState)
      .every(value => value === 'success')
    this.setState(validationState)
    if (!validationSuccess) {
      return
    }
    const slideId = _.uniqueId()
    if (worldId === 'CREATE_NEW') {
      const worldId = _.uniqueId()
      dispatch(createItem('WORLD', worldName, worldId))
      dispatch(createItem('SLIDE', slideName, slideId, { worldId }))
      dispatch(closeModal())
    } else {
      dispatch(createItem('SLIDE', slideName, slideId, { worldId }))
      dispatch(closeModal())
    }
  }
  addNamesToFormFields () {
    document.querySelector(
      '#' + this.slideNameInputControlId
    ).name = 'slideName'
    document.querySelector('#' + this.worldIdInputControlId).name = 'worldId'
    const worldNameElement = document.querySelector(
      '#' + this.worldNameInputControlId
    )
    if (worldNameElement !== null) {
      worldNameElement.name = 'worldName'
    }
  }
  componentDidMount () {
    this.addNamesToFormFields()
  }
  componentDidUpdate () {
    this.addNamesToFormFields()
  }
  handleSelect () {
    const formData = new window.FormData(this.form)
    if (formData.get('worldId') === 'CREATE_NEW') {
      this.setState({ createNewWorld: true })
    } else {
      this.setState({ createNewWorld: false })
    }
  }
  render () {
    const { dispatch, worlds, selectedWorldId } = this.props
    let defaultValue
    if (worlds.length === 0 || this.state.createNewWorld) {
      defaultValue = 'CREATE_NEW'
    } else {
      defaultValue = selectedWorldId
    }
    return (
      <div>
        <Modal.Header>
          <Modal.Title>Add slide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            ref={element => { this.form = element }}
            onSubmit={e => e.preventDefault()}
          >
            <FormGroup
              controlId={this.slideNameInputControlId}
              validationState={this.state.slideNameValidationState}
            >
              <ControlLabel>Slide name: </ControlLabel>
              <FormControl type='text' />
            </FormGroup>
            <FormGroup
              controlId={this.worldIdInputControlId}
              validationState={this.state.worldIdValidationState}
            >
              <ControlLabel>World: </ControlLabel>
              <FormControl
                componentClass='select'
                placeholder='World'
                defaultValue={defaultValue}
                onChange={() => { this.handleSelect() }}
              >
                {worlds.map(world => (
                  <option
                    value={world.id}
                    key={world.id}
                    >
                    {world.name}
                  </option>
                  ))}
                <option value='CREATE_NEW'>Create new...</option>
              </FormControl>
            </FormGroup>
            {defaultValue === 'CREATE_NEW' && (
              <FormGroup
                controlId={this.worldNameInputControlId}
                validationState={this.state.worldNameValidationState}
              >
                <ControlLabel>World name: </ControlLabel>
                <FormControl type='text' />
              </FormGroup>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={() => this.addSlide()}>
            Add slide
          </Button>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
        </Modal.Footer>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    worlds: state.worlds.array,
    selectedWorldId: state.worlds.selectedId
  }
}
export default connect(mapStateToProps)(AddSlide)
