import * as fastTravelInputAction from "../features/optional/major/fastTravel/callbacks/inputAction";

const functionMap = new Map<
  ButtonAction,
  (player: EntityPlayer) => float | null
>();
export default functionMap;

// 0
functionMap.set(ButtonAction.ACTION_LEFT, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 1
functionMap.set(ButtonAction.ACTION_RIGHT, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 2
functionMap.set(ButtonAction.ACTION_UP, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 3
functionMap.set(ButtonAction.ACTION_DOWN, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 4
functionMap.set(ButtonAction.ACTION_SHOOTLEFT, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 5
functionMap.set(ButtonAction.ACTION_SHOOTRIGHT, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 6
functionMap.set(ButtonAction.ACTION_SHOOTUP, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});

// 7
functionMap.set(ButtonAction.ACTION_SHOOTDOWN, () => {
  const returnValue = fastTravelInputAction.disableInput();
  if (returnValue !== null) {
    return returnValue;
  }

  return null;
});
