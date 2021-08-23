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

// InputHook.IS_ACTION_TRIGGERED (1)
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
