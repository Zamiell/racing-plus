import * as fastTravelInputAction from "../features/optional/major/fastTravel/callbacks/inputAction";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | null) => float | void
>();
export default functionMap;

// 0
functionMap.set(ButtonAction.ACTION_LEFT, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 1
functionMap.set(ButtonAction.ACTION_RIGHT, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 2
functionMap.set(ButtonAction.ACTION_UP, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 3
functionMap.set(ButtonAction.ACTION_DOWN, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 4
functionMap.set(ButtonAction.ACTION_SHOOTLEFT, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 5
functionMap.set(ButtonAction.ACTION_SHOOTRIGHT, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 6
functionMap.set(ButtonAction.ACTION_SHOOTUP, () => {
  return fastTravelInputAction.disableInputFloat();
});

// 7
functionMap.set(ButtonAction.ACTION_SHOOTDOWN, () => {
  return fastTravelInputAction.disableInputFloat();
});
