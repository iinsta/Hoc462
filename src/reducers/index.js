import { combineReducers } from 'redux'
import slidesReducer from './slides'
import worldsReducer from './worlds'
import modalReducer from './modal'
import actionToEvent from './actionToEvent'
export default combineReducers({
  slides: slidesReducer,
  worlds: worldsReducer,
  modal: modalReducer,
  actionToEvent
})
