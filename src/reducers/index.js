import { combineReducers } from "redux";
import slidesReducer from "./slides";
import worldsReducer from "./worlds";
import modalReducer from "./modal";
export default combineReducers({
  slides: slidesReducer,
  worlds: worldsReducer,
  modal: modalReducer
});
