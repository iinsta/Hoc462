import React from 'react'
import ReactDOM from 'react-dom'
import { Nav, Navbar, Col } from 'react-bootstrap'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { Modal, Slides, Worlds, MapEditor, SlideSidebar } from './components'
import reducer from './reducers'
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
const store = createStore(
  reducer,
  {
    worlds: {
      array: []
    },
    slides: {
      array: []
    }
  },
  applyMiddleware(logger)
)
const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand><a>Hoc462</a></Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <Slides />
            <Worlds />
          </Nav>
        </Navbar>
        <Modal />
        <Col xs={4}>
          <SlideSidebar />
        </Col>
        <Col xs={8}>
          <MapEditor />
        </Col>
      </div>
    </Provider>
  )
}
ReactDOM.render(<App />, document.getElementById('root'))
