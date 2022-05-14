import { ButtonAction } from "isaac-typescript-definitions";
import * as autofire from "../features/optional/hotkeys/autofire";

export const getActionValueFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => float | void
>();

// 4
getActionValueFunctions.set(
  ButtonAction.SHOOT_LEFT,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);

// 5
getActionValueFunctions.set(
  ButtonAction.SHOOT_RIGHT,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);

// 6
getActionValueFunctions.set(
  ButtonAction.SHOOT_UP,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);

// 7
getActionValueFunctions.set(
  ButtonAction.SHOOT_DOWN,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);
