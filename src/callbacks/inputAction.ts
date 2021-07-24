// Different actions occur on different inputHooks and this is not documented
// Thus, each action's particular inputHook must be determined through trial and error
// Also note that we can't use cached API functions in this callback or else the game will crash
// ButtonAction.ACTION_MENUCONFIRM (14) is bugged and will never fire

import getActionValueFunctions from "./getActionValueFunctions";
import isActionTriggeredFunctions from "./isActionTriggeredFunctions";

export function main(
  entity: Entity | null,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | void {
  const inputHookFunction = inputHookFunctionMap.get(inputHook);
  if (inputHookFunction !== undefined) {
    return inputHookFunction(entity, buttonAction);
  }

  return undefined;
}

const inputHookFunctionMap = new Map<
  InputHook,
  (entity: Entity | null, buttonAction: ButtonAction) => number | boolean | void
>();

// 1
inputHookFunctionMap.set(
  InputHook.IS_ACTION_TRIGGERED,
  (entity: Entity | null, buttonAction: ButtonAction) => {
    const isActionTriggeredFunction =
      isActionTriggeredFunctions.get(buttonAction);
    if (isActionTriggeredFunction !== undefined) {
      return isActionTriggeredFunction(entity);
    }

    return undefined;
  },
);

// 2
inputHookFunctionMap.set(
  InputHook.GET_ACTION_VALUE,
  (entity: Entity | null, buttonAction: ButtonAction) => {
    const getActionValueFunction = getActionValueFunctions.get(buttonAction);
    if (getActionValueFunction !== undefined) {
      return getActionValueFunction(entity);
    }

    return undefined;
  },
);
