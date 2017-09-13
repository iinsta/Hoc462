import createListReducer from './createListReducer'
const worldsReducer = createListReducer((state, { type, payload }) => {
  const { array: worlds, selectedId } = state
  switch (type) {
    case 'WALL_ADDED':
      return {
        ...state,
        array: worlds.map(world => ({
          ...world,
          walls:
            world.id === selectedId
              ? (world.walls || []).concat([payload])
              : (world.walls || [])
        }))
      }
    default:
      return state
  }
}, 'WORLD')
export default worldsReducer
