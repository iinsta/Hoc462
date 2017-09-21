import { connect } from 'react-redux'
import EditableList from './EditableList'
import { openModal } from '../actions'
export default connect(
  state => {
    const selectedItem = state.slides.array.find(
      slide => slide.id === state.slides.selectedId
    )
    return {
      name: 'Slides',
      itemType: 'SLIDE',
      items: state.slides.array,
      selectedItem
    }
  },
  dispatch => {
    return {
      onAdd: () => dispatch(openModal('addSlide')),
      dispatch
    }
  }
)(EditableList)
