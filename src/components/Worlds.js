import { connect } from "react-redux";
import EditableList from "./EditableList";
import { openModal } from "../actions";
export default connect(
  state => {
    const selectedItem = state.worlds.array.filter(
      world => world.id === state.worlds.selectedId
    )[0];
    return {
      name: "Worlds",
      itemType: "WORLD",
      items: state.worlds.array,
      selectedItem
    };
  },
  dispatch => {
    return {
      dispatch,
      onAdd: () => dispatch(openModal("addWorld"))
    };
  }
)(EditableList);
