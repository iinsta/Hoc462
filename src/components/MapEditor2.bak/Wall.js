import React from 'react'
class Wall extends React.Component {
  constructor () {
    super()
    const { scene, wallHeight, startX, startY, endX, endY, color } = this.props
    const boxGeometry = new THREE.BoxGeometry(width, 16, height)
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    })
    const box = new THREE.Mesh(cubeGeometry, cubeMaterial)
    scene.add(box)
    this.object3d = box
    this._updateBox()
  }
  _updateBox () {
    const { wallHeight, startX, startY, endX, endY, color } = this.props
    const gridToWorld = (x, y) => ({
      x: (x + 1 - mapWidth / 2) * wallSize,
      z: (y + 1 - mapHeight / 2) * wallSize
    })
    const box = this.object3d
    const width = (Math.abs(startX - endX) + 1) * wallSize
    const height = (Math.abs(startY - endY) + 1) * wallSize
    const worldStartPosition = gridToWorld(startX, startY)
    const worldX = worldStartPosition.x - width / 2
    const worldZ = worldStartPosition.z - height / 2
    const worldY = wallHeight
    box.position.set(worldX, worldY, worldZ)
    const boxGeometry = new THREE.BoxGeometry(width, 16, height)
    box.geometry = boxGeometry
  }
  componentDidUpdate () {
    this._updateBox()
  }
  render () {
    return null
  }
}
