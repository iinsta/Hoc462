export default (startX, startY, endX, endY, worldId) => ({
  type: 'WALL_ADDED',
  payload: {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    worldId
  }
})
