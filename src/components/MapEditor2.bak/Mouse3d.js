import THREELib from 'three-js'
const THREE = THREELib()
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
const Mouse3d = (canvas, camera) => {
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
  return {
    onClick (object3d, callback) {
      canvas.addEventListener('click', event => {
        raycast(event, object3d, callback)
      })
    },
    onDrag (object3d, callback) {
      let dragStartedOnObject3d = false
      bindDrag(canvas, (event, phase, fingers) => {
        if (phase === 'drag started') {
          raycast(event, object3d, intersects => {
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
          dragStartedOnObject3d = false
          callback(null, phase)
        }
      })
    }
  }
}
export default Mouse3d
