// Different actions occur on different inputHooks and this is not documented
// Thus, each action's particular inputHook must be determined through trial and error
// Also note that we can't use cached API functions in this callback or else the game will crash
// ButtonAction.ACTION_MENUCONFIRM (14) is bugged and will never fire

import getActionValueFunctions from "./getActionValueFunctions";
import isActionTriggeredFunctions from "./isActionTriggeredFunctions";

export function main(
  player: EntityPlayer,
  inputHook: InputHook,
  buttonAction: ButtonAction,
): number | boolean | null {
  const inputHookFunction = inputHookFunctionMap.get(inputHook);
  if (inputHookFunction !== undefined) {
    return inputHookFunction(player, buttonAction);
  }

  return null;
}

const inputHookFunctionMap = new Map<
  InputHook,
  (player: EntityPlayer, buttonAction: ButtonAction) => number | boolean | null
>();

// 0
inputHookFunctionMap.set(
  InputHook.IS_ACTION_PRESSED,
  (_player: EntityPlayer, _buttonAction: ButtonAction) => {
    // Currently unused
    return null;
  },
);

// 1
inputHookFunctionMap.set(
  InputHook.IS_ACTION_TRIGGERED,
  (player: EntityPlayer, buttonAction: ButtonAction) => {
    const isActionTriggeredFunction =
      isActionTriggeredFunctions.get(buttonAction);
    if (isActionTriggeredFunction !== undefined) {
      return isActionTriggeredFunction(player);
    }

    return null;
  },
);

// 2
inputHookFunctionMap.set(
  InputHook.GET_ACTION_VALUE,
  (player: EntityPlayer, buttonAction: ButtonAction) => {
    const getActionValueFunction = getActionValueFunctions.get(buttonAction);
    if (getActionValueFunction !== undefined) {
      return getActionValueFunction(player);
    }

    return null;
  },
);
