import {
  ButtonAction,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import { mod } from "../mod";
import { getActionValueFunctions } from "./getActionValueFunctions";
import { isActionPressedFunctions } from "./isActionPressedFunctions";
import { isActionTriggeredFunctions } from "./isActionTriggeredFunctions";

export function init(): void {
  mod.AddCallback(
    ModCallback.INPUT_ACTION,
    isActionPressed,
    InputHook.IS_ACTION_PRESSED, // 0
  );

  mod.AddCallback(
    ModCallback.INPUT_ACTION,
    isActionTriggered,
    InputHook.IS_ACTION_TRIGGERED, // 1
  );

  mod.AddCallback(
    ModCallback.INPUT_ACTION,
    getActionValue,
    InputHook.GET_ACTION_VALUE, // 2
  );
}

// InputHook.IS_ACTION_PRESSED (0)
function isActionPressed(
  entity: Entity | undefined,
  _inputHook: InputHook,
  buttonAction: ButtonAction,
): boolean | undefined {
  const isActionPressedFunction = isActionPressedFunctions.get(buttonAction);
  if (isActionPressedFunction !== undefined) {
    return isActionPressedFunction(entity);
  }

  return undefined;
}

// InputHook.IS_ACTION_TRIGGERED (1)
function isActionTriggered(
  entity: Entity | undefined,
  _inputHook: InputHook,
  buttonAction: ButtonAction,
): boolean | undefined {
  const isActionTriggeredFunction =
    isActionTriggeredFunctions.get(buttonAction);
  if (isActionTriggeredFunction !== undefined) {
    return isActionTriggeredFunction(entity);
  }

  return undefined;
}

// InputHook.GET_ACTION_VALUE (2)
function getActionValue(
  entity: Entity | undefined,
  _inputHook: InputHook,
  buttonAction: ButtonAction,
): float | undefined {
  const getActionValueFunction = getActionValueFunctions.get(buttonAction);
  if (getActionValueFunction !== undefined) {
    return getActionValueFunction(entity);
  }

  return undefined;
}
