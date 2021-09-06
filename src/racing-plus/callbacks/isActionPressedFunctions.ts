import * as autofire from "../features/optional/hotkeys/autofire";

const functionMap = new Map<
  ButtonAction,
  (entity: Entity | undefined) => boolean | void
>();
export default functionMap;

// 4
functionMap.set(ButtonAction.ACTION_SHOOTLEFT, (entity: Entity | undefined) => {
  return autofire.inputActionIsActionPressedShoot(entity);
});

// 5
functionMap.set(
  ButtonAction.ACTION_SHOOTRIGHT,
  (entity: Entity | undefined) => {
    return autofire.inputActionIsActionPressedShoot(entity);
  },
);

// 6
functionMap.set(ButtonAction.ACTION_SHOOTUP, (entity: Entity | undefined) => {
  return autofire.inputActionIsActionPressedShoot(entity);
});

// 7
functionMap.set(ButtonAction.ACTION_SHOOTDOWN, (entity: Entity | undefined) => {
  return autofire.inputActionIsActionPressedShoot(entity);
});
