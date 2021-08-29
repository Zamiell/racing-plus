import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_PICKUP_COLLISION,
    lilBattery,
    PickupVariant.PICKUP_LIL_BATTERY, // 90
  );
}

export function lilBattery(
  pickup: EntityPickup,
  collider: Entity,
  _low: boolean,
): boolean | void {
  return chargePocketItemFirst.prePickupCollisionLilBattery(pickup, collider);
}
