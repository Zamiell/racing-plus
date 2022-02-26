import {
  anyPlayerHasCollectible,
  getPlayerFromIndex,
} from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { insertPickupAndUpdateDelta } from "../automaticItemInsertion";
import { PICKUP_VARIANT_CARD_OR_PILL } from "../constants";
import v from "../v";

export function automaticItemInsertionPostPickupInit(
  pickup: EntityPickup,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  checkIfExpectingPickupDrop(pickup);
}

function checkIfExpectingPickupDrop(pickup: EntityPickup) {
  for (let i = 0; i < v.room.pickupQueue.length; i++) {
    const [lookingForPickupVariant, playerIndex] = v.room.pickupQueue[i];

    const player = getPlayerFromIndex(playerIndex);
    if (player === undefined) {
      continue;
    }

    const effectivePickupVariant = getEffectivePickupVariant(
      pickup,
      lookingForPickupVariant,
    );
    if (effectivePickupVariant !== pickup.Variant) {
      continue;
    }

    insertPickupAndUpdateDelta(pickup, player);
    v.room.pickupQueue.splice(i, 1);

    return;
  }
}

// The pickup that an item normally drops may not be the pickup that we should be looking to
// automatically insert
// Perform a conversion if necessary
function getEffectivePickupVariant(
  pickup: EntityPickup,
  lookingForPickupVariant: PickupVariant,
) {
  const hasStarterDeck = anyPlayerHasCollectible(
    CollectibleType.COLLECTIBLE_STARTER_DECK,
  ); // Other players can change the drops
  const hasLittleBaggy = anyPlayerHasCollectible(
    CollectibleType.COLLECTIBLE_LITTLE_BAGGY,
  ); // Other players can change the drops

  if (
    lookingForPickupVariant ===
      (PICKUP_VARIANT_CARD_OR_PILL as PickupVariant) &&
    (pickup.Variant === PickupVariant.PICKUP_TAROTCARD ||
      pickup.Variant === PickupVariant.PICKUP_PILL)
  ) {
    // Handle the case where we need to automatically insert either a card or a pill
    return pickup.Variant;
  }

  if (hasStarterDeck && hasLittleBaggy) {
    // If both conversion items are present, they cancel each other out
    return lookingForPickupVariant;
  }

  if (hasStarterDeck && lookingForPickupVariant === PickupVariant.PICKUP_PILL) {
    // Starter Deck will convert all pills to cards
    return PickupVariant.PICKUP_TAROTCARD;
  }

  if (hasLittleBaggy && lookingForPickupVariant === PickupVariant.PICKUP_PILL) {
    // Little Baggy will convert all cards to pills
    return PickupVariant.PICKUP_PILL;
  }

  return lookingForPickupVariant;
}
