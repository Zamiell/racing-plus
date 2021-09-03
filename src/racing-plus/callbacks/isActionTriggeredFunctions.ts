import * as switchForgotten from "../features/mandatory/switchForgotten";
import * as raceInputAction from "../features/race/callbacks/inputAction";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | null) => boolean | void
>();
export default functionMap;

// 11
functionMap.set(ButtonAction.ACTION_DROP, () => {
  return switchForgotten.actionDrop();
});

// 28
functionMap.set(ButtonAction.ACTION_CONSOLE, () => {
  return raceInputAction.isActionTriggeredConsole();
});
