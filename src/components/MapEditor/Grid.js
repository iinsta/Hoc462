import React from 'react'
import { connect } from 'react-redux'
import THREELib from 'three-js'
const THREE = THREELib()
class Grid extends React.Component {
  componentDidMount () {
    const {
      mapWidth,
      mapHeight,
      wallSize,
      scene,
      mouse3d,
      gridTexture,
      dispatch
    } = this.props
    const { onDrag } = mouse3d
    const planeTexture = new THREE.Texture(gridTexture.canvas)
    planeTexture.minFilter = THREE.LinearFilter
    this.object3d = new THREE.Mesh(
      new THREE.PlaneGeometry(mapWidth * wallSize, mapHeight * wallSize),
      new THREE.MeshBasicMaterial({ map: planeTexture, side: THREE.DoubleSide })
    )
    scene.add(this.object3d)
    this.object3d.rotation.x = (-Math.PI) / 2
    const addWalls = () => {
      const rectangles = gridTexture.done()
      rectangles.forEach(rectangle => {
        const startX = Math.max(rectangle.start.x, rectangle.end.x)
        const startY = Math.max(rectangle.start.y, rectangle.end.y)
        const endX = Math.min(rectangle.start.x, rectangle.end.x)
        const endY = Math.min(rectangle.start.y, rectangle.end.y)
        dispatch({
          type: 'WALL_ADDED',
          payload: {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY }
          }
        })
      })
    }
    onDrag(this.object3d, (intersects, phase) => {
      if (phase === 'drag ended') {
        addWalls()
        return
      }
      const clickPositionRelativeToPlane = new THREE.Vector3().copy(
        intersects[0].point
      )
      intersects[0].object.worldToLocal(clickPositionRelativeToPlane)
      const { x: planeX, y: planeY } = clickPositionRelativeToPlane
      const gridX = planeX / wallSize + mapWidth / 2 | 0
      const gridY = mapHeight - 1 - (planeY / wallSize + mapHeight / 2 | 0)
      if (phase === 'drag started') {
        gridTexture.select({
          start: { x: gridX, y: gridY },
          end: { x: gridX, y: gridY }
        })
      }
      if (phase === 'dragging') {
        gridTexture.select({ end: { x: gridX, y: gridY } })
      }
    })
    const animate = () => {
      planeTexture.needsUpdate = true
      window.requestAnimationFrame(animate)
    }
    animate()
  }
  componentWillUnmount () {
    this.props.scene.remove(this.object3d)
  }
  render () {
    return null
  }
}
export default connect()(Grid)
