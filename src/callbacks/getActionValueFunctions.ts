import * as fastTravelInputAction from "../features/optional/major/fastTravel/callbacks/inputAction";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | null) => float | void
>();
export default functionMap;

// 0
functionMap.set(ButtonAction.ACTION_LEFT, () => {
  return fastTravelInputAction.disableInput();
});

// 1
functionMap.set(ButtonAction.ACTION_RIGHT, () => {
  return fastTravelInputAction.disableInput();
});

// 2
functionMap.set(ButtonAction.ACTION_UP, () => {
  return fastTravelInputAction.disableInput();
});

// 3
functionMap.set(ButtonAction.ACTION_DOWN, () => {
  return fastTravelInputAction.disableInput();
});

// 4
functionMap.set(ButtonAction.ACTION_SHOOTLEFT, () => {
  return fastTravelInputAction.disableInput();
});

// 5
functionMap.set(ButtonAction.ACTION_SHOOTRIGHT, () => {
  return fastTravelInputAction.disableInput();
});

// 6
functionMap.set(ButtonAction.ACTION_SHOOTUP, () => {
  return fastTravelInputAction.disableInput();
});

// 7
functionMap.set(ButtonAction.ACTION_SHOOTDOWN, () => {
  return fastTravelInputAction.disableInput();
});
