import _ from 'underscore'
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
export default GridTexture
