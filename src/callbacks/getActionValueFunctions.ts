import * as autofire from "../features/optional/hotkeys/autofire";

export const getActionValueFunctions = new Map<
  ButtonAction,
  (entity: Entity | undefined) => float | void
>();

// 4
getActionValueFunctions.set(
  ButtonAction.ACTION_SHOOTLEFT,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);

// 5
getActionValueFunctions.set(
  ButtonAction.ACTION_SHOOTRIGHT,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);

// 6
getActionValueFunctions.set(
  ButtonAction.ACTION_SHOOTUP,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);

// 7
getActionValueFunctions.set(
  ButtonAction.ACTION_SHOOTDOWN,
  (entity: Entity | undefined) =>
    autofire.inputActionGetActionValueShoot(entity),
);
