import * as raceInputAction from "../features/race/callbacks/inputAction";

export const isActionTriggeredFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | void
>();

// 28
isActionTriggeredFunctions.set(ButtonAction.ACTION_CONSOLE, () => {
  return raceInputAction.isActionTriggeredConsole();
});
