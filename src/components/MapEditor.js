import React from 'react'
import ReactDOM from 'react-dom'
import { Jumbotron } from 'react-bootstrap'
import _ from 'underscore'
import THREELib from 'three-js'
import { connect } from 'react-redux'
const THREE = THREELib(['OrbitControls'])
const mousePosition = (element, event) => {
  const rect = element.getBoundingClientRect()
  const normal = {
    x: (event.clientX - rect.left) / rect.width * element.width,
    y: (event.clientY - rect.top) / rect.height * element.height
  }
  const webgl = {
    x: normal.x / rect.width * 2 - 1,
    y: -(normal.y / rect.height) * 2 + 1
  }
  return { normal, webgl }
}
const bindDrag = (element, callback) => {
  let isDragging = false
  const toMouseEvent = callback => {
    return event => {
      callback(event.touches[0], event.touches.length)
    }
  }
  const startDragging = (event, fingers) => {
    if (!isDragging) {
      isDragging = true
      callback(event, 'drag started', fingers)
    } else {
      stopDragging(event, fingers)
    }
  }
  const whileDragging = (event, fingers) => {
    if (isDragging) {
      callback(event, 'dragging', fingers)
    }
  }
  const stopDragging = (event, fingers) => {
    isDragging = false
    callback(event, 'drag ended', fingers)
  }
  element.addEventListener('mousedown', startDragging)
  element.addEventListener('touchstart', toMouseEvent(startDragging))
  element.addEventListener('mousemove', whileDragging)
  element.addEventListener('touchmove', toMouseEvent(whileDragging))
  element.addEventListener('mouseup', stopDragging)
  element.addEventListener('touchend', toMouseEvent(stopDragging))
}
const GridTexture = (gridWidth, gridHeight) => {
  const canvas = document.createElement('canvas')
  const cellWidth = 32
  const cellHeight = 32
  const ctx = canvas.getContext('2d')
  const selectedRectangles = []
  const usedSquares = new Map()
  let gridBackground, currentSelectedRectangle
  const calculateRectangle = rectangle => {
    const { start, end } = rectangle
    const x = Math.min(start.x, end.x) * cellWidth
    const y = Math.min(start.y, end.y) * cellHeight
    const width = (Math.abs(end.x - start.x) + 1) * cellWidth
    const height = (Math.abs(end.y - start.y) + 1) * cellHeight
    return { x, y, width, height }
  }
  const createGridBackground = () => {
    const background = document.createElement('canvas')
    background.width = canvas.width
    background.height = canvas.height
    const ctx = background.getContext('2d')
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    for (let y = 0; y < canvas.width; y += cellWidth) {
      ctx.moveTo(0.5 + y, 0)
      ctx.lineTo(0.5 + y, canvas.width)
    }
    for (let x = 0; x < canvas.height; x += cellHeight) {
      ctx.moveTo(0, 0.5 + x)
      ctx.lineTo(canvas.height, 0.5 + x)
    }
    ctx.stroke()
    return background
  }
  const resize = (width, height) => {
    if (width !== undefined && height !== undefined) {
      gridWidth = width
      gridHeight = height
    }
    canvas.width = gridWidth * cellWidth + 1
    canvas.height = gridHeight * cellHeight + 1
    gridBackground = createGridBackground()
    ctx.drawImage(gridBackground, 0, 0)
  }
  const normalizeRectangle = rectangle => {
    const newRectangle = _.clone(rectangle)
    newRectangle.start = {
      x: Math.min(rectangle.start.x, rectangle.end.x),
      y: Math.min(rectangle.start.y, rectangle.end.y)
    }
    newRectangle.end = {
      x: Math.max(rectangle.start.x, rectangle.end.x),
      y: Math.max(rectangle.start.y, rectangle.end.y)
    }
    return newRectangle
  }
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    selectedRectangles.forEach(rectangle => {
      ctx.fillStyle = 'yellow'
      const { x, y, width, height } = calculateRectangle(rectangle)
      ctx.fillRect(x, y, width, height)
    })
    let { x, y, width, height } = calculateRectangle(currentSelectedRectangle)
    ctx.lineWidth = 6
    ctx.strokeStyle = 'white'
    if (x === canvas.width) {
      x -= 1
    }
    if (x === 0) {
      x += 1
    }
    if (y === canvas.height) {
      y -= 1
    }
    if (y === 0) {
      y += 1
    }
    if (x + width === canvas.width) {
      width -= 1
    }
    if (y + height === canvas.height) {
      height -= 1
    }
    ctx.rect(x, y, width, height)
    ctx.stroke()
    ctx.lineWidth = 1
    ctx.drawImage(gridBackground, 0, 0)
  }
  resize()
  return {
    canvas,
    resize,
    select (rectangle) {
      if (
        rectangle.start === undefined &&
        (currentSelectedRectangle === undefined ||
          currentSelectedRectangle.start === undefined)
      ) {
        return
      }
      if (currentSelectedRectangle === undefined) {
        const lastSelectedRectangle =
          selectedRectangles[selectedRectangles.length - 1]
        if (lastSelectedRectangle !== undefined) {
          currentSelectedRectangle = lastSelectedRectangle
        } else {
          currentSelectedRectangle = {}
        }
      }
      const newRectangle = _.clone(currentSelectedRectangle)
      _.extend(newRectangle, rectangle)
      const normalized = normalizeRectangle(newRectangle)
      for (let x = normalized.start.x; x <= normalized.end.x; x++) {
        for (let y = normalized.start.y; y <= normalized.end.y; y++) {
          if (usedSquares.has(x + ',' + y)) {
            return
          }
        }
      }
      _.extend(currentSelectedRectangle, newRectangle)
      if (selectedRectangles.length === 0) {
        selectedRectangles.push(currentSelectedRectangle)
      }
      render()
    },
    next () {
      if (selectedRectangles.length > 0) {
        currentSelectedRectangle = {}
        selectedRectangles.push(currentSelectedRectangle)
      }
    },
    noOverlap (rectangle) {
      const normalized = normalizeRectangle(rectangle)
      for (let x = normalized.start.x; x <= normalized.end.x; x++) {
        for (let y = normalized.start.y; y <= normalized.end.y; y++) {
          usedSquares.set(x + ',' + y, 1)
        }
      }
    },
    allowOverlap (rectangle) {
      const normalized = normalizeRectangle(rectangle)
      for (let x = normalized.start.x; x <= normalized.end.x; x++) {
        for (let y = normalized.start.y; y <= normalized.end.y; y++) {
          usedSquares.delete(x + ',' + y)
        }
      }
    },
    resetEverything () {
      usedSquares.clear()
      selectedRectangles.length = 0
      currentSelectedRectangle = undefined
    },
    done () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(gridBackground, 0, 0)
      const returnValue = [...selectedRectangles]
      selectedRectangles.length = 0
      currentSelectedRectangle = undefined
      return returnValue
    },
    peek () {
      return [...selectedRectangles]
    }
  }
}
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
    new THREE.MeshBasicMaterial({
      map: planeTexture,
      side: THREE.DoubleSide
    })
  )
  plane.rotation.x = -Math.PI / 2
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
  /*
  const onClick = (object3d, callback) => {
    canvas.addEventListener('click', event => {
      raycast(event, object3d, callback)
    })
  }
  */
  const onDrag = (object3d, callback) => {
    let dragStartedOnObject3d = false
    bindDrag(canvas, (event, phase, fingers) => {
      if (fingers > 1) {
        controls.enabled = true
        return
      }
      if (phase === 'drag started') {
        raycast(event, object3d, intersects => {
          controls.enabled = false
          dragStartedOnObject3d = true
          callback(intersects, phase)
        })
      }
      if (phase === 'dragging') {
        if (dragStartedOnObject3d) {
          raycast(event, object3d, intersects => {
            callback(intersects, phase)
          })
        }
      }
      if (phase === 'drag ended') {
        controls.enabled = true
        dragStartedOnObject3d = false
        callback(null, phase)
      }
    })
  }
  const raycast = (event, object3d, callback) => {
    const raycaster = new THREE.Raycaster()
    const { x, y } = mousePosition(canvas, event).webgl
    const mouse = new THREE.Vector2(x, y)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects([object3d])
    if (intersects.length > 0) {
      callback(intersects)
    }
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
    const gridX = (planeX / wallSize + mapWidth / 2) | 0
    const gridY = mapHeight - 1 - ((planeY / wallSize + mapHeight / 2) | 0)
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
  shouldComponentUpdate () {
    return false
  }
  componentDidMount () {
    const root = ReactDOM.findDOMNode(this.root)
    MapEditor(root, this.props.dispatch)
  }
  render () {
    return (
      <Jumbotron
        className='map-editor'
        ref={element => (this.root = element)}
      />
    )
  }
}
export default connect()(MapEditorWrapper)
