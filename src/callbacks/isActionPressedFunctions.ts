import { ButtonAction } from "isaac-typescript-definitions";
import * as autofire from "../features/optional/hotkeys/autofire";

export const isActionPressedFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | undefined
>();

// 4
isActionPressedFunctions.set(
  ButtonAction.SHOOT_LEFT,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);

// 5
isActionPressedFunctions.set(
  ButtonAction.SHOOT_RIGHT,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);

// 6
isActionPressedFunctions.set(
  ButtonAction.SHOOT_UP,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);

// 7
isActionPressedFunctions.set(
  ButtonAction.SHOOT_DOWN,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);
