import { CollectibleType, PickupVariant } from "isaac-typescript-definitions";
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
  const index = findMatchingPickupQueueIndex(pickup);
  if (index === undefined) {
    return;
  }

  const tuple = v.room.pickupQueue[index];
  if (tuple === undefined) {
    return;
  }

  const [, playerIndex] = tuple;
  const player = getPlayerFromIndex(playerIndex);
  if (player === undefined) {
    return;
  }

  insertPickupAndUpdateDelta(pickup, player);
  v.room.pickupQueue.splice(index, 1);
}

function findMatchingPickupQueueIndex(pickup: EntityPickup): int | undefined {
  const index = v.room.pickupQueue.findIndex(
    ([lookingForPickupVariant, playerIndex]) => {
      const player = getPlayerFromIndex(playerIndex);
      if (player === undefined) {
        return false;
      }

      const effectivePickupVariant = getEffectivePickupVariant(
        pickup,
        lookingForPickupVariant,
      );
      return effectivePickupVariant === pickup.Variant;
    },
  );

  return index === -1 ? undefined : index;
}

/**
 * The pickup that an item normally drops may not be the pickup that we should be looking to
 * automatically insert.
 *
 * Perform a conversion if necessary.
 */
function getEffectivePickupVariant(
  pickup: EntityPickup,
  lookingForPickupVariant: PickupVariant,
) {
  const hasStarterDeck = anyPlayerHasCollectible(CollectibleType.STARTER_DECK); // Other players can change the drops
  const hasLittleBaggy = anyPlayerHasCollectible(CollectibleType.LITTLE_BAGGY); // Other players can change the drops

  if (
    lookingForPickupVariant ===
      (PICKUP_VARIANT_CARD_OR_PILL as PickupVariant) &&
    (pickup.Variant === PickupVariant.TAROT_CARD ||
      pickup.Variant === PickupVariant.PILL)
  ) {
    // Handle the case where we need to automatically insert either a card or a pill.
    return pickup.Variant;
  }

  if (hasStarterDeck && hasLittleBaggy) {
    // If both conversion items are present, they cancel each other out.
    return lookingForPickupVariant;
  }

  if (hasStarterDeck && lookingForPickupVariant === PickupVariant.PILL) {
    // Starter Deck will convert all pills to cards.
    return PickupVariant.TAROT_CARD;
  }

  if (hasLittleBaggy && lookingForPickupVariant === PickupVariant.PILL) {
    // Little Baggy will convert all cards to pills.
    return PickupVariant.PILL;
  }

  return lookingForPickupVariant;
}
