const chooseWorldDialogReducer = (state = { open: false }, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SHOW_CHOOSE_WORLD_DIALOG":
      return { open: true };
      break;
    case "HIDE_CHOOSE_WORLD_DIALOG":
      return { open: false };
      break;
    default:
      return state;
  }
};
