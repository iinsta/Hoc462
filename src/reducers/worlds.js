import createListReducer from './createListReducer'
const worldsReducer = createListReducer((state, { type, payload }) => {
  const { array: worlds } = state
  switch (type) {
    case 'WALL_ADDED':
      const { worldId } = payload
      return {
        ...state,
        array: worlds.map(world => ({
          ...world,
          walls:
            world.id === worldId
              ? (world.walls || []).concat([payload])
              : (world.walls || [])
        }))
      }
    default:
      return state
  }
}, 'WORLD')
export default worldsReducer
