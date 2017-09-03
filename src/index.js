import React from "react";
import ReactDOM from "react-dom";
import { Nav, Navbar } from "react-bootstrap";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import { Modal, Slides, Worlds } from "./components";
import reducer from "./reducers";
import "./style.css";
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
);
const App = () => {
  return (
    <Provider store={store}>
      <div>
        <link
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossOrigin="anonymous"
        />
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
      </div>
    </Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
