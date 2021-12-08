import * as autofire from "../features/optional/hotkeys/autofire";

export const isActionPressedFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | void
>();

// 4
isActionPressedFunctions.set(
  ButtonAction.ACTION_SHOOTLEFT,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);

// 5
isActionPressedFunctions.set(
  ButtonAction.ACTION_SHOOTRIGHT,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);

// 6
isActionPressedFunctions.set(
  ButtonAction.ACTION_SHOOTUP,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);

// 7
isActionPressedFunctions.set(
  ButtonAction.ACTION_SHOOTDOWN,
  (entity: Entity | undefined) =>
    autofire.inputActionIsActionPressedShoot(entity),
);
