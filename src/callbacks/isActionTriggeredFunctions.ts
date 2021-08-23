import * as switchForgotten from "../features/mandatory/switchForgotten";
import * as fastTravelInputAction from "../features/optional/major/fastTravel/callbacks/inputAction";
import * as raceInputAction from "../features/race/callbacks/inputAction";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | null) => boolean | void
>();
export default functionMap;

// 8
functionMap.set(ButtonAction.ACTION_BOMB, () => {
  let value;

  value = raceInputAction.isActionTriggeredBomb();
  if (value !== undefined) {
    return value;
  }

  value = fastTravelInputAction.disableInputBoolean();
  if (value !== undefined) {
    return value;
  }

  return undefined;
});

// 9
functionMap.set(ButtonAction.ACTION_ITEM, () => {
  return fastTravelInputAction.disableInputBoolean();
});

// 10
functionMap.set(ButtonAction.ACTION_PILLCARD, () => {
  return fastTravelInputAction.disableInputBoolean();
});

// 11
functionMap.set(ButtonAction.ACTION_DROP, () => {
  let value: boolean | void;

  value = switchForgotten.actionDrop();
  if (value !== undefined) {
    return value;
  }

  value = fastTravelInputAction.disableInputBoolean();
  if (value !== undefined) {
    return value;
  }

  return undefined;
});

// 28
functionMap.set(ButtonAction.ACTION_CONSOLE, () => {
  return raceInputAction.isActionTriggeredConsole();
});
