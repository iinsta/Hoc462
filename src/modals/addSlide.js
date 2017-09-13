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
  handleSelectWorld (e) {
    const formData = new window.FormData(this.form)
    const worldId = formData.get('worldId')
    if (worldId === 'CREATE_NEW') {
      this.setState({ createNewWorld: true })
    } else {
      this.setState({ createNewWorld: false })
    }
  }
  componentDidUpdate () {
    const worldNameElement = document.querySelector(
      '#' + this.worldNameInputControlId
    )
    if (worldNameElement !== null) {
      worldNameElement.name = 'worldName'
    }
  }
  addSlide () {
    const { dispatch } = this.props
    const formData = new window.FormData(this.form)
    const slideName = formData.get('slideName')
    const worldId = formData.get('worldId')
    const worldName = formData.get('worldName')
    const validationState = {}
    validationState.slideNameValidationState =
      slideName === '' ? 'error' : 'success'
    validationState.worldIdValidationState =
      worldId === 'EMPTY' ? 'error' : 'success'
    validationState.worldNameValidationState =
      worldName === '' ? 'error' : 'success'
    const validationSuccess = Object.values(validationState).every(
      value => value === 'success'
    )
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
  componentDidMount () {
    document.querySelector('#' + this.slideNameInputControlId).name =
      'slideName'
    document.querySelector('#' + this.worldIdInputControlId).name = 'worldId'
  }
  render () {
    const { dispatch, worlds } = this.props
    return (
      <div>
        <Modal.Header>
          <Modal.Title>Add slide</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form
            ref={element => (this.form = element)}
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
                onChange={e => this.handleSelectWorld(e)}
              >
                <option value='EMPTY' />
                {worlds.map(world =>
                  <option value={world.id} key={world.id}>
                    {world.name}
                  </option>
                )}
                <option value='CREATE_NEW'>Create new...</option>
              </FormControl>
            </FormGroup>
            {this.state.createNewWorld &&
              <FormGroup
                controlId={this.worldNameInputControlId}
                validationState={this.state.worldNameValidationState}
              >
                <ControlLabel>World name: </ControlLabel>
                <FormControl type='text' />
              </FormGroup>}
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
    worlds: state.worlds.array
  }
}
export default connect(mapStateToProps)(AddSlide)
