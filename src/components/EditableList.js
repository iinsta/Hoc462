import React from "react";
import { ListInMenu } from "./List";
import { selectItem, swapItems, deleteItem } from "../actions";
const EditableList = ({
  items,
  selectedItem,
  name,
  itemType,
  onAdd,
  onDelete = () => dispatch(deleteItem(itemType, selectedItemId)),
  dispatch
}) => {
  const onSelect = id => dispatch(selectItem(itemType, id));
  const currentItemIndex = items.indexOf(selectedItem);
  const itemAboveId = (items[currentItemIndex - 1] || {}).id;
  const itemBelowId = (items[currentItemIndex + 1] || {}).id;
  const selectedItemId = (selectedItem || {}).id;
  const moveUp = () =>
    dispatch(swapItems(itemType + "S", itemAboveId, selectedItemId));
  const moveDown = () =>
    dispatch(swapItems(itemType + "S", itemBelowId, selectedItemId));
  const props = {
    items,
    onSelect,
    actions: [
      { title: "Create new", icon: "plus", callback: onAdd },
      { title: "Move up", icon: "arrow-up", callback: moveUp },
      { title: "Move down", icon: "arrow-down", callback: moveDown },
      { title: "Delete", icon: "trash", callback: onDelete }
    ]
  };
  if (selectedItem === undefined) {
    return <ListInMenu {...props} title={name} />;
  } else {
    return (
      <ListInMenu
        title={`${name} (Selected: ${selectedItem.name})`}
        selectedId={selectedItem.id}
        {...props}
      />
    );
  }
};
export default EditableList;
