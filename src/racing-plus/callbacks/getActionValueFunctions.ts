import * as autofire from "../features/optional/hotkeys/autofire";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | undefined) => float | void
>();
export default functionMap;

// 4
functionMap.set(ButtonAction.ACTION_SHOOTLEFT, (entity: Entity | undefined) => {
  return autofire.inputActionGetActionValueShoot(entity);
});

// 5
functionMap.set(
  ButtonAction.ACTION_SHOOTRIGHT,
  (entity: Entity | undefined) => {
    return autofire.inputActionGetActionValueShoot(entity);
  },
);

// 6
functionMap.set(ButtonAction.ACTION_SHOOTUP, (entity: Entity | undefined) => {
  return autofire.inputActionGetActionValueShoot(entity);
});

// 7
functionMap.set(ButtonAction.ACTION_SHOOTDOWN, (entity: Entity | undefined) => {
  return autofire.inputActionGetActionValueShoot(entity);
});
