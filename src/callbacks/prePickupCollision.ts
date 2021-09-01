import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_PRE_PICKUP_COLLISION,
    key,
    PickupVariant.PICKUP_KEY, // 30
  );

  mod.AddCallback(
    ModCallbacks.MC_PRE_PICKUP_COLLISION,
    lilBattery,
    PickupVariant.PICKUP_LIL_BATTERY, // 90
  );
}

// PickupVariant.PICKUP_KEY (30)
function key(pickup: EntityPickup, collider: Entity, _low: boolean) {
  return chargePocketItemFirst.prePickupCollisionKey(pickup, collider);
}

// PickupVariant.PICKUP_LIL_BATTERY (90)
function lilBattery(pickup: EntityPickup, collider: Entity, _low: boolean) {
  return chargePocketItemFirst.prePickupCollisionLilBattery(pickup, collider);
}
