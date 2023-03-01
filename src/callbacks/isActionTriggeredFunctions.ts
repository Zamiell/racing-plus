import { ButtonAction } from "isaac-typescript-definitions";
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
