// TODO Spun
// f.DrawString("01", 60, 50, KCOLOR_DEFAULT, 0, true);

import {
  anyPlayerHasCollectible,
  PickingUpItem,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import {
  COLLECTIBLE_TO_PICKUP_DROPS_MAP,
  PICKUP_VARIANT_CARD_OR_PILL,
} from "./constants";
import insertPickup from "./insertPickup";

export const v = {
  run: {
    /**
     * Track which pickups that we are automatically inserting so that we can display it to the
     * player on the UI.
     */
    delta: {
      coins: null as int | null,
      coinsFrame: null as int | null,
      bombs: null as int | null,
      bombsFrame: null as int | null,
      keys: null as int | null,
      keysFrame: null as int | null,
      pocketItem: null as int | null,
      pocketItemFrame: null as int | null,
      trinket: null as int | null,
      trinketFrame: null as int | null,
    },
  },

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

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {}

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

    // Some pickups cannot be automatically inserted
    const pickupInserted = insertPickup(pickup, player);
    if (pickupInserted !== null) {
      // Only remove the pickup if it has been successfully inserted
      pickup.Remove();

      // Track what it inserted so that we can display it on the UI
      updateDelta(pickupInserted);
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

function updateDelta(pickupInserted: [PickupVariant, int]) {
  const gameFrameCount = g.g.GetFrameCount();

  const [pickupType, value] = pickupInserted;
  switch (pickupType) {
    case PickupVariant.PICKUP_COIN: {
      if (v.run.delta.coins === null) {
        v.run.delta.coins = 0;
      }
      v.run.delta.coins += value;
      v.run.delta.coinsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_BOMB: {
      if (v.run.delta.bombs === null) {
        v.run.delta.bombs = 0;
      }
      v.run.delta.bombs += value;
      v.run.delta.bombsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_KEY: {
      if (v.run.delta.keys === null) {
        v.run.delta.keys = 0;
      }
      v.run.delta.keys += value;
      v.run.delta.keysFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_TAROTCARD:
    case PickupVariant.PICKUP_PILL: {
      if (v.run.delta.pocketItem === null) {
        v.run.delta.pocketItem = 0;
      }
      v.run.delta.pocketItem += value;
      v.run.delta.pocketItemFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_TRINKET: {
      if (v.run.delta.trinket === null) {
        v.run.delta.trinket = 0;
      }
      v.run.delta.trinket += value;
      v.run.delta.trinketFrame = gameFrameCount;

      return;
    }

    default: {
      error("Unknown pickup variant in the updateDelta");
    }
  }
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
