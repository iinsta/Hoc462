import React from 'react'
import ReactDOM from 'react-dom'
import { Jumbotron } from 'react-bootstrap'
import _ from 'underscore'
import THREELib from 'three-js'
import { connect } from 'react-redux'
import GridTexture from './GridTexture'
import Mouse3d from './Mouse3d'
const THREE = THREELib([ 'OrbitControls' ])
const MapEditor = (mapEditorRoot, dispatch) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const canvas = renderer.domElement
  mapEditorRoot.appendChild(canvas)
  const resize = () => {
    canvas.style.cssText = ''
    const {
      clientWidth: width,
      clientHeight: height,
      width: oldWidth,
      height: oldHeight
    } = canvas
    if (width !== oldWidth || height !== oldHeight) {
      renderer.setSize(width, height)
      if (camera !== undefined) {
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
    }
    return { width, height }
  }
  const { width, height } = resize()
  const wallSize = 16
  const mapWidth = 32
  const mapHeight = 32
  const gridTexture = GridTexture(32, 32)
  window.gridTexture = gridTexture
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
  const { onDrag, onClick } = Mouse3d(canvas, camera)
  camera.position.y = 160
  camera.position.z = 400
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  const pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(1, 1, 2)
  camera.add(pointLight)
  scene.add(camera)
  const controls = new THREE.OrbitControls(camera, canvas)
  const planeTexture = new THREE.Texture(gridTexture.canvas)
  planeTexture.needsUpdate = true
  planeTexture.minFilter = THREE.LinearFilter
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(mapWidth * wallSize, mapHeight * wallSize),
    new THREE.MeshBasicMaterial({ map: planeTexture, side: THREE.DoubleSide })
  )
  plane.rotation.x = (-Math.PI) / 2
  scene.add(plane)
  const render = () => {
    planeTexture.needsUpdate = true
    resize()
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
  }
  const addWalls = () => {
    const rectangles = gridTexture.done()
    rectangles.forEach(rectangle => {
      gridTexture.noOverlap(rectangle)
      const startX = Math.max(rectangle.start.x, rectangle.end.x)
      const startY = Math.max(rectangle.start.y, rectangle.end.y)
      const endX = Math.min(rectangle.start.x, rectangle.end.x)
      const endY = Math.min(rectangle.start.y, rectangle.end.y)
      dispatch({
        type: 'WALL_ADDED',
        payload: { start: { x: startX, y: startY }, end: { x: endX, y: endY } }
      })
      function gridToWorld (x, y) {
        const worldX = (x + 1 - mapWidth / 2) * wallSize
        const worldZ = (y + 1 - mapHeight / 2) * wallSize
        return { x: worldX, z: worldZ }
      }
      const width = (Math.abs(startX - endX) + 1) * wallSize
      const height = (Math.abs(startY - endY) + 1) * wallSize
      const worldStartPosition = gridToWorld(startX, startY)
      const worldX = worldStartPosition.x - width / 2
      const worldZ = worldStartPosition.z - height / 2
      const worldY = 8
      const cubeGeometry = new THREE.BoxGeometry(width, 16, height)
      const cubeMaterial = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff
      })
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.set(worldX, worldY, worldZ)
      scene.add(cube)
    })
  }
  onDrag(plane, (intersects, phase) => {
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
  render()
}
class MapEditorWrapper extends React.Component {
  constructor () {
    super()
    this.userHasJustSelectedAWorld = false
  }
  componentWillReceiveProps (next) {
    this.userHasJustSelectedAWorld = next.userSelectedAWorld &&
      !this.props.userSelectedAWorld
  }
  componentDidUpdate () {
    const root = ReactDOM.findDOMNode(this.root)
    if (root !== null && this.userHasJustSelectedAWorld) {
      MapEditor(root, this.props.dispatch)
    }
  }
  render () {
    const { userSelectedAWorld } = this.props
    if (userSelectedAWorld) {
      return (
        <div>
          <Jumbotron
            className='map-editor'
            ref={element => this.root = element}
          />
        </div>
      )
    } else {
      return <Jumbotron><h1>No worlds selected.</h1></Jumbotron>
    }
  }
}
export default connect(state => {
  const selectedItem = state.worlds.array.find(
    world => world.id === state.worlds.selectedId
  )
  if (selectedItem === undefined) {
    return { userSelectedAWorld: false }
  }
  return {
    userSelectedAWorld: true,
    walls: selectedItem.walls,
    sprites: selectedItem.sprites
  }
})(MapEditorWrapper)
