import React from 'react'
import THREELib from 'three-js'
const THREE = THREELib()
class Wall extends React.Component {
  componentDidMount () {
    this.object3d = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
    )
    this.props.scene.add(this.object3d)
    this.updateObject()
  }
  componentDidUpdate () {
    this.updateObject()
  }
  removeWallFromGridTexture () {
    const {
      startX: oldStartX,
      endX: oldEndX,
      startY: oldStartY,
      endY: oldEndY,
      gridTexture
    } = this.props
    const startX = Math.max(oldStartX, oldEndX)
    const startY = Math.max(oldStartY, oldEndY)
    const endX = Math.min(oldStartX, oldEndX)
    const endY = Math.min(oldStartY, oldEndY)
    gridTexture.allowOverlap({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    })
  }
  componentWillUpdate () {
    this.removeWallFromGridTexture()
  }
  updateObject () {
    const {
      startX: oldStartX,
      endX: oldEndX,
      startY: oldStartY,
      endY: oldEndY,
      height = 1,
      color = 0xffff00,
      wallSize,
      mapWidth,
      mapHeight,
      gridTexture
    } = this.props
    const startX = Math.max(oldStartX, oldEndX)
    const startY = Math.max(oldStartY, oldEndY)
    const endX = Math.min(oldStartX, oldEndX)
    const endY = Math.min(oldStartY, oldEndY)
    gridTexture.noOverlap({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    })
    const gridToWorld = (x, y) => {
      const worldX = (x + 1 - mapWidth / 2) * wallSize
      const worldZ = (y + 1 - mapHeight / 2) * wallSize
      return { x: worldX, z: worldZ }
    }
    const width = (Math.abs(startX - endX) + 1) * wallSize
    const length = (Math.abs(startY - endY) + 1) * wallSize
    const worldStartPosition = gridToWorld(startX, startY)
    const worldX = worldStartPosition.x - width / 2
    const worldZ = worldStartPosition.z - length / 2
    const worldY = height * wallSize / 2
    this.object3d.position.set(worldX, worldY, worldZ)
    this.object3d.material.color.setHex(color)
    this.object3d.geometry = new THREE.BoxGeometry(
      width,
      height * wallSize,
      length
    )
  }
  componentWillUnmount () {
    this.removeWallFromGridTexture()
    this.props.scene.remove(this.object3d)
  }
  render () {
    return null
  }
}
export default Wall
