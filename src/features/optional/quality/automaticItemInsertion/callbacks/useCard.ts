import { getPickups } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { insertPickupAndUpdateDelta } from "../automaticItemInsertion";

// Card.CARD_JUSTICE (9)
export function automaticItemInsertionUseCardJustice(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  // The PostPickupInit callback fires before this one, so we cannot use the existing queue system
  // to automatically insert items
  // Instead, find the nearest coin, bomb, and key to the player
  const pickupVariants = [
    PickupVariant.PICKUP_COIN,
    PickupVariant.PICKUP_BOMB,
    PickupVariant.PICKUP_KEY,
  ];
  for (const pickupVariant of pickupVariants) {
    const pickup = getClosestPickup(player, pickupVariant);
    if (pickup !== null) {
      insertPickupAndUpdateDelta(pickup, player);
    }
  }
}

function getClosestPickup(entity: Entity, pickupVariant: PickupVariant) {
  const pickups = getPickups(pickupVariant);

  let closestPickup: EntityPickup | null = null;
  let closestDistance: int | null = null;
  for (const pickup of pickups) {
    // Skip over pickups that have a price
    if (pickup.Price !== 0) {
      continue;
    }

    // Skip over pickups that have already been collected
    const sprite = pickup.GetSprite();
    if (sprite.IsPlaying("Collect")) {
      continue;
    }

    const distance = entity.Position.Distance(pickup.Position);

    if (closestPickup === null || closestDistance === null) {
      closestPickup = pickup;
      closestDistance = distance;
      continue;
    }

    if (distance < closestDistance) {
      closestPickup = pickup;
      closestDistance = distance;
    }
  }

  return closestPickup;
}
