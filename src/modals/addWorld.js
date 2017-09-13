import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Prompt from './prompt'
import { createItem } from '../actions'
const AddWorld = ({ dispatch }) => {
  return (
    <Prompt
      title='Add world'
      content='World name: '
      done={worldName => dispatch(createItem('WORLD', worldName, _.uniqueId()))}
    />
  )
}
const mapDispatchToProps = dispatch => {
  return { dispatch }
}
export default connect(undefined, mapDispatchToProps)(AddWorld)
