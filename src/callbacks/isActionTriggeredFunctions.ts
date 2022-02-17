import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as raceInputAction from "../features/race/callbacks/inputAction";
import * as season2 from "../features/speedrun/season2";

export const isActionTriggeredFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | void
>();

// 28
isActionTriggeredFunctions.set(
  ButtonAction.ACTION_CONSOLE,
  (_entity: Entity | undefined) => {
    let returnValue: boolean | void;

    /*
    returnValue = season2.isActionTriggeredConsole();
    if (returnValue !== undefined) {
      return returnValue;
    }
    */

    returnValue = raceInputAction.isActionTriggeredConsole();
    if (returnValue !== undefined) {
      return returnValue;
    }

    return undefined;
  },
);

// 9
isActionTriggeredFunctions.set(
  ButtonAction.ACTION_ITEM,
  (entity: Entity | undefined) =>
    chargePocketItemFirst.isActionTriggeredItem(entity),
);
