import * as raceInputAction from "../features/race/callbacks/inputAction";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | void
>();
export default functionMap;

// 28
functionMap.set(ButtonAction.ACTION_CONSOLE, () => {
  return raceInputAction.isActionTriggeredConsole();
});
