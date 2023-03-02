import {
  ButtonAction,
  InputHook,
  ModCallback,
} from "isaac-typescript-definitions";
import { mod } from "../mod";
import { isActionTriggeredFunctions } from "./isActionTriggeredFunctions";

export function init(): void {
  mod.AddCallback(
    ModCallback.INPUT_ACTION,
    isActionTriggered,
    InputHook.IS_ACTION_TRIGGERED, // 1
  );
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
