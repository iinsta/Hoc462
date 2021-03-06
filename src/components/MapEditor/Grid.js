import React from 'react'
import { connect } from 'react-redux'
import * as THREE from 'three'
import { addWall } from '../../actions'
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
        dispatch(addWall(startX, startY, endX, endY, this.props.worldId))
        // this.props.worldId instead of worldId because it changes.
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
export default connect(state => {
  return {
    worldId: (state.slides.array.find(
      ({id}) => id === state.slides.selectedId
    ) || {}).worldId
  }
})(Grid)
