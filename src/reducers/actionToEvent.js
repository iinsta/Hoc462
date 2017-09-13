import storeEvents from '../storeEvents'
const actionToEvent = (state = null, { type, payload }) => {
  storeEvents.dispatchEvent(new window.CustomEvent(type, { detail: payload }))
  return state
}
export default actionToEvent
