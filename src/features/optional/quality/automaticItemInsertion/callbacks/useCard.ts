import { getPickups, initArray, isBethany } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { insertPickupAndUpdateDelta } from "../automaticItemInsertion";

// Card.CARD_HIEROPHANT (6)
export function automaticItemInsertionUseCardHierophant(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  const character = player.GetPlayerType();

  if (character !== PlayerType.PLAYER_BETHANY) {
    return;
  }

  addHeartsOnBethanys(player);
}

// Card.CARD_LOVERS (7)
export function automaticItemInsertionUseCardLovers(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  const character = player.GetPlayerType();

  if (character !== PlayerType.PLAYER_BETHANY_B) {
    return;
  }

  addHeartsOnBethanys(player);
}

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

  if (isBethany(player)) {
    pickupVariants.push(PickupVariant.PICKUP_HEART);
  }

  if (player.HasCollectible(CollectibleType.COLLECTIBLE_TAROT_CLOTH)) {
    pickupVariants.push(PickupVariant.PICKUP_COIN);
    pickupVariants.push(PickupVariant.PICKUP_BOMB);
    pickupVariants.push(PickupVariant.PICKUP_KEY);
    if (isBethany(player)) {
      pickupVariants.push(PickupVariant.PICKUP_HEART);
    }
  }

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

function addHeartsOnBethanys(player: EntityPlayer) {
  // The PostPickupInit callback fires before this one, so we cannot use the existing queue system
  // to automatically insert items
  // Instead, find the nearest hearts to the player
  const hasTarotCloth = player.HasCollectible(
    CollectibleType.COLLECTIBLE_TAROT_CLOTH,
  );
  const numHearts = hasTarotCloth ? 3 : 2;
  const pickupVariants = initArray(PickupVariant.PICKUP_HEART, numHearts);

  for (const pickupVariant of pickupVariants) {
    const pickup = getClosestPickup(player, pickupVariant);
    if (pickup !== null) {
      insertPickupAndUpdateDelta(pickup, player);
    }
  }
}
