import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as raceInputAction from "../features/race/callbacks/inputAction";
import * as speedrunInputAction from "../features/speedrun/callbacks/inputAction";

export const isActionTriggeredFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | void
>();

// 28
isActionTriggeredFunctions.set(
  ButtonAction.ACTION_CONSOLE,
  (_entity: Entity | undefined) => {
    speedrunInputAction.isActionTriggeredConsole();
    return raceInputAction.isActionTriggeredConsole();
  },
);

// 9
isActionTriggeredFunctions.set(
  ButtonAction.ACTION_ITEM,
  (entity: Entity | undefined) =>
    chargePocketItemFirst.isActionTriggeredItem(entity),
);
