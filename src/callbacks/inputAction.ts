// Different actions occur on different inputHooks and this is not documented
// Thus, each action's particular inputHook must be determined through trial and error
// Also note that we can't use cached API functions in this callback or else the game will crash
// ButtonAction.ACTION_MENUCONFIRM (14) is bugged and will never fire

import getActionValueFunctions from "./getActionValueFunctions";
import isActionTriggeredFunctions from "./isActionTriggeredFunctions";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_INPUT_ACTION,
    isActionTriggered,
    InputHook.IS_ACTION_TRIGGERED, // 1
  );

  mod.AddCallback(
    ModCallbacks.MC_INPUT_ACTION,
    getActionValue,
    InputHook.GET_ACTION_VALUE, // 2
  );
}

// InputHook.IS_ACTION_PRESSED (1)
function isActionTriggered(
  entity: Entity | null,
  _inputHook: InputHook,
  buttonAction: ButtonAction,
) {
  const isActionTriggeredFunction =
    isActionTriggeredFunctions.get(buttonAction);
  if (isActionTriggeredFunction !== undefined) {
    return isActionTriggeredFunction(entity);
  }

  return undefined;
}

// InputHook.GET_ACTION_VALUE (2)
function getActionValue(
  entity: Entity | null,
  _inputHook: InputHook,
  buttonAction: ButtonAction,
) {
  const getActionValueFunction = getActionValueFunctions.get(buttonAction);
  if (getActionValueFunction !== undefined) {
    return getActionValueFunction(entity);
  }

  return undefined;
}
