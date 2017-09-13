import React from 'react'
import { connect } from 'react-redux'
import Confirm from './confirm.js'
import deleteItem from '../actions/deleteItem.js'
const DeleteWorld = ({ dispatch, worldDeleted, slides }) => {
  const willBeDeleted = slides.filter(slide => slide.worldId === worldDeleted)
  const decide = deleteThisWorld => {
    if (deleteThisWorld) {
      dispatch(deleteItem('WORLD', worldDeleted))
    }
  }
  return (
    <Confirm
      title='Do you want to delete this world?'
      content={
        'The following ' +
        willBeDeleted.length +
        ' slides will be deleted: ' +
        willBeDeleted.map(slide => slide.name).join(', ')
      }
      onFinish={decide}
    />
  )
}
const mapStateToProps = state => ({ slides: state.slides.array })
export default connect(mapStateToProps)(DeleteWorld)
