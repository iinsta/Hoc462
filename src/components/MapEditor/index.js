import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Jumbotron } from 'react-bootstrap'
import * as THREE from 'three'
import Mouse3d from './Mouse3d'
import Wall from './Wall'
import GridTexture from './GridTexture'
import Grid from './Grid'
const OrbitControls = require('three-orbit-controls')(THREE)
class MapEditor extends React.Component {
  componentWillMount () {
    const scene = this.scene = new THREE.Scene()
    const camera = this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000)
    camera.position.y = 160
    camera.position.z = 400
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(1, 1, 2)
    camera.add(pointLight)
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(500, 500) // canvas size will be changed later
    const canvas = this.canvas = renderer.domElement
    const controls = new OrbitControls(camera, canvas)
    const animate = () => {
      const resizeCanvasToDisplaySize = () => {
        const canvas = renderer.domElement
        // you must remove inline style or the code will never work
        canvas.style.cssText = ''
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        if (canvas.width !== width || canvas.height !== height) {
          renderer.setSize(width, height)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }
      }
      resizeCanvasToDisplaySize()
      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(animate)
    }
    animate()
    const commonProps = {
      scene: this.scene,
      mouse3d: Mouse3d(this.canvas, this.camera),
      wallSize: 16,
      mapWidth: this.props.mapWidth || 32,
      mapHeight: this.props.mapHeight || 32
    }
    commonProps.gridTexture = GridTexture(
      commonProps.mapWidth,
      commonProps.mapHeight
    )
    this.commonProps = commonProps
  }
  componentDidMount () {
    ReactDOM.findDOMNode(this.root).appendChild(this.canvas)
  }
  render () {
    const { commonProps } = this
    return (
      <Jumbotron
        className='map-editor'
        ref={root => {
          this.root = root
        }}
      >
        <Grid {...commonProps} />
        {
          this.props.walls.map(wall => (
            <Wall
              {...commonProps}
              startX={wall.start.x}
              startY={wall.start.y}
              endX={wall.end.x}
              endY={wall.end.y}
            />
          ))
        }
      </Jumbotron>
    )
  }
}
export default connect(state => {
  const selectedSlide = state.slides.array.find(
    ({id}) => id === state.slides.selectedId
  )
  const worldOfSelectedSlide = state.worlds.array.find(
    ({id}) => id === selectedSlide.worldId
  )
  return {
    walls: (worldOfSelectedSlide || {}).walls || [],
    worldId: (selectedSlide || {}).worldId
  }
})(MapEditor)
