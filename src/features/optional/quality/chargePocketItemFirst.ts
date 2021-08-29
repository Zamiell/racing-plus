import { config } from "../../../modConfigMenu";

export function prePickupCollisionLilBattery(
  pickup: EntityPickup,
  collider: Entity,
): boolean | void {
  if (!config.chargePocketItemFirst) {
    return undefined;
  }

  const player = collider.ToPlayer();
  if (player === null) {
    return undefined;
  }

  // TODO
}
