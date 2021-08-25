import * as disableAllInputs from "../features/mandatory/disableAllInputs";
import isActionTriggeredFunctions from "./isActionTriggeredFunctions";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_INPUT_ACTION,
    isActionPressed,
    InputHook.IS_ACTION_PRESSED, // 0
  );

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

// InputHook.IS_ACTION_PRESSED (0)
function isActionPressed(
  _entity: Entity | null,
  _inputHook: InputHook,
  _buttonAction: ButtonAction,
) {
  return disableAllInputs.isActionPressed();
}

// InputHook.IS_ACTION_TRIGGERED (1)
function isActionTriggered(
  entity: Entity | null,
  _inputHook: InputHook,
  buttonAction: ButtonAction,
) {
  const value = disableAllInputs.isActionTriggered();
  if (value !== undefined) {
    return value;
  }

  const isActionTriggeredFunction =
    isActionTriggeredFunctions.get(buttonAction);
  if (isActionTriggeredFunction !== undefined) {
    return isActionTriggeredFunction(entity);
  }

  return undefined;
}

// InputHook.GET_ACTION_VALUE (2)
function getActionValue(
  _entity: Entity | null,
  _inputHook: InputHook,
  _buttonAction: ButtonAction,
) {
  return disableAllInputs.getActionValue();
}
