import React from 'react'
import { connect } from 'react-redux'
export default connect(state => {
  const { selectedId } = state.slides
  const currentSlide = state.slides.array.find(({ id }) => id === selectedId)
  if (currentSlide === undefined) {
    return { isASlideSelected: false }
  } else {
    return { isASlideSelected: true, ...currentSlide }
  }
})(({ isASlideSelected, view, walls, sprites, animations, dispatch }) =>
  <div>
    {
      !isASlideSelected
      ? <i>No slide selected</i>
      : [
        <div>AJD</div>,
        <div>JAV</div>
      ]
    }
  </div>
)
