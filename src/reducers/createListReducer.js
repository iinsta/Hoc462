const swapElementsInArray = (array, element1, element2) => {
  return array.map(element => {
    if (element === element1) {
      return element2;
    } else if (element === element2) {
      return element1;
    }
    return element;
  });
};
const createListReducer = (reducer, reducerName) => {
  return (state = { array: [], selectedId: null }, action) => {
    const { type, payload } = action;
    switch (type) {
      case "ADD_" + reducerName:
        return { ...state, array: [...state.array, payload] };
        break;
      case "DELETE_" + reducerName:
        return {
          ...state,
          array: state.array.filter(element => element.id !== payload.id)
        };
        break;
      case "SWAP_" + reducerName + "S":
        const [item1, item2] = state.array.filter(
          item => item.id === payload.firstId || item.id === payload.secondId
        );
        if (item1 === undefined || item2 === undefined) {
          return state;
        }
        return {
          ...state,
          array: swapElementsInArray(state.array, item1, item2)
        };
        break;
      case "EDIT_" + reducerName:
        return {
          ...state,
          array: state.array.map(
            element =>
              element.id === payload.id
                ? { ...element, ...payload.edited }
                : element
          )
        };
        break;
      case "SELECT_" + reducerName:
        return {
          ...state,
          selectedId: payload.id
        };
        break;
      default:
        return reducer(state, action);
        break;
    }
  };
};
export default createListReducer;
