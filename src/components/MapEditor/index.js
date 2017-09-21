import React from 'react'
import { connect } from 'react-redux'
import THREELib from 'three-js'
import Mouse3d from './Mouse3d'
import Wall from './Wall'
import GridTexture from './GridTexture'
import Grid from './Grid'
const THREE = THREELib(['OrbitControls'])
class MapEditor extends React.Component {
  componentWillMount () {
    const scene = this.scene = new THREE.Scene()
    const camera = this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000)
    scene.add(camera)
    camera.position.y = 160
    camera.position.z = 400
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(500, 500)
    const canvas = this.canvas = renderer.domElement
    const controls = new THREE.OrbitControls(camera, canvas)
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(animate)
    }
    animate()
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    const pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(1, 1, 2)
    camera.add(pointLight)
    scene.add(camera)
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
    this.root.appendChild(this.canvas)
  }
  render () {
    const { commonProps } = this
    return (<div ref={root => { this.root = root }}>
      <Grid {...commonProps} />
      {this.props.walls.map(
        wall => <Wall
          {...commonProps}
          startX={wall.start.x}
          startY={wall.start.y}
          endX={wall.end.x}
          endY={wall.end.y}
        />)}
    </div>)
  }
}
export default connect(state => ({
  walls: ((state.worlds.array.find(
    world => world.id === state.worlds.selectedId
  ) || {}).walls || [])
}))(MapEditor)
