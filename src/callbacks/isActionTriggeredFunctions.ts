import { ButtonAction } from "isaac-typescript-definitions";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as raceInputAction from "../features/race/callbacks/inputAction";

export const isActionTriggeredFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | undefined
>();

// 28
isActionTriggeredFunctions.set(
  ButtonAction.CONSOLE,
  (_entity: Entity | undefined) => raceInputAction.isActionTriggeredConsole(),
);

// 9
isActionTriggeredFunctions.set(
  ButtonAction.ITEM,
  (entity: Entity | undefined) =>
    chargePocketItemFirst.isActionTriggeredItem(entity),
);
