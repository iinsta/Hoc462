import createListReducer from "./createListReducer";
const slidesReducer = createListReducer((state, {type, payload}) => {
  switch (type) {
    case "DELETE_WORLD":
      return {
        ...state,
        array: state.array.filter(slide => slide.worldId !== payload.id)
      };
    default:
      return state;
  }
}, "SLIDE");
export default slidesReducer;
