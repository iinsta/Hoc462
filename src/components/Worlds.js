import React from 'react'
import { connect } from 'react-redux'
import EditableList from './EditableList'
import { openModal, deleteItem } from '../actions'
export default connect(
  state => {
    const selectedItem = state.worlds.array.find(
      world => world.id === state.worlds.selectedId
    )
    return {
      name: 'Worlds',
      itemType: 'WORLD',
      items: state.worlds.array,
      slides: state.slides.array,
      selectedItem
    }
  },
  dispatch => {
    return {
      dispatch,
      onAdd: () => dispatch(openModal('addWorld')),
      onDelete: worldDeleted =>
        dispatch(openModal('deleteWorld', { worldDeleted }))
    }
  }
)(({ onDelete, slides, ...props }) =>
  <EditableList
    onDelete={() => {
      const {selectedItem: {id: worldId}, dispatch} = props
      const slidesDeleted = slides.filter(slide => slide.worldId === worldId)
      if (slidesDeleted.length > 0) {
        onDelete(worldId)
      } else {
        dispatch(deleteItem('WORLD', worldId))
      }
    }}
    {...props}
  />
)
