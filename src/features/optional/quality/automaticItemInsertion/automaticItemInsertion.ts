import {
  anyPlayerHasCollectible,
  PickingUpItem,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import {
  COLLECTIBLE_TO_PICKUP_DROPS_MAP,
  PICKUP_VARIANT_CARD_OR_PILL,
} from "./constants";
import insertPickup from "./insertPickup";

const v = {
  room: {
    pickupQueue: [] as Array<[PickupVariant, EntityPtr]>,
  },
};

export function init(): void {
  saveDataManager("automaticItemInsertion", v, featureEnabled);
}

function featureEnabled() {
  return config.automaticItemInsertion;
}

// ModCallbacks.MC_POST_PICKUP_INIT (34)
export function postPickupInit(pickup: EntityPickup): void {
  checkIfExpectingPickupDrop(pickup);
}

function checkIfExpectingPickupDrop(pickup: EntityPickup) {
  for (let i = 0; i < v.room.pickupQueue.length; i++) {
    const [lookingForPickupVariant, playerPtr] = v.room.pickupQueue[i];

    if (playerPtr.Ref === null) {
      continue;
    }

    const player = playerPtr.Ref.ToPlayer();
    if (player === null) {
      continue;
    }

    const effectivePickupVariant = getEffectivePickupVariant(
      pickup,
      lookingForPickupVariant,
    );
    if (effectivePickupVariant !== pickup.Variant) {
      continue;
    }

    // Some pickups cannot be automatically inserted;
    // only remove the pickup if it has been successfully inserted
    if (insertPickup(pickup, player)) {
      pickup.Remove();
    }

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
  );
  const hasLittleBaggy = anyPlayerHasCollectible(
    CollectibleType.COLLECTIBLE_LITTLE_BAGGY,
  );

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

// ModCallbacksCustom.MC_PRE_ITEM_PICKUP
export function preItemPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  checkIfItemDropsPickups(player, pickingUpItem);
}

function checkIfItemDropsPickups(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
) {
  if (
    pickingUpItem.type === ItemType.ITEM_NULL ||
    pickingUpItem.type === ItemType.ITEM_TRINKET
  ) {
    return;
  }

  const collectibleType = pickingUpItem.id as CollectibleType;
  const pickupVariants = COLLECTIBLE_TO_PICKUP_DROPS_MAP.get(collectibleType);
  if (pickupVariants === undefined) {
    return;
  }

  // This item drops pickups, so record what we expect to spawn, and then wait for later
  for (const pickupVariant of pickupVariants) {
    const queueArray: [PickupVariant, EntityPtr] = [
      pickupVariant,
      EntityPtr(player),
    ];
    v.room.pickupQueue.push(queueArray);
  }
}
