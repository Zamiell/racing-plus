import {
  anyPlayerHasCollectible,
  collectibleHasTag,
  getPickups,
  getPlayerFromIndex,
  getPlayerIndex,
  getPlayerNumTransformationCollectibles,
  getScreenBottomLeftPos,
  getScreenBottomRightPos,
  isFirstPlayer,
  PickingUpItem,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";
import {
  BOMBS_Y,
  BOTTOM_CORNER_OFFSET,
  COINS_X_OFFSET,
  COINS_Y,
  COLLECTIBLE_TO_PICKUP_DROPS_MAP,
  FRAMES_BEFORE_FADE,
  KEYS_Y,
  PICKUP_VARIANT_CARD_OR_PILL,
  UI_X,
} from "./constants";
import { insertPickup } from "./insertPickup";

const v = {
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
    pickupQueue: [] as Array<[PickupVariant, PlayerIndex]>,
  },
};

export function init(): void {
  saveDataManager("automaticItemInsertion", v, featureEnabled);
}

function featureEnabled() {
  return config.automaticItemInsertion;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  drawCoinsDelta();
  drawBombsDelta();
  drawKeysDelta();
  drawPocketItemsDelta();
  drawTrinketsDelta();
}

function drawCoinsDelta() {
  if (v.run.delta.coins !== null && v.run.delta.coinsFrame !== null) {
    const string = v.run.delta.coins.toString().padStart(2, "0");
    const text = `+${string}`;

    const fade = getFade(v.run.delta.coinsFrame);
    if (fade <= 0) {
      v.run.delta.coins = null;
      v.run.delta.coinsFrame = null;
      return;
    }

    const player = Isaac.GetPlayer();
    const hasDeepPockets = player.HasCollectible(
      CollectibleType.COLLECTIBLE_DEEP_POCKETS,
    );
    const x = hasDeepPockets ? UI_X + COINS_X_OFFSET : UI_X;

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, x, COINS_Y, color, 0, true);
  }
}

function drawKeysDelta() {
  if (v.run.delta.keys !== null && v.run.delta.keysFrame !== null) {
    const string = v.run.delta.keys.toString().padStart(2, "0");
    const text = `+${string}`;

    const fade = getFade(v.run.delta.keysFrame);
    if (fade <= 0) {
      v.run.delta.keys = null;
      v.run.delta.keysFrame = null;
      return;
    }

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, UI_X, KEYS_Y, color, 0, true);
  }
}

function drawBombsDelta() {
  if (v.run.delta.bombs !== null && v.run.delta.bombsFrame !== null) {
    const string = v.run.delta.bombs.toString().padStart(2, "0");
    const text = `+${string}`;

    const fade = getFade(v.run.delta.bombsFrame);
    if (fade <= 0) {
      v.run.delta.bombs = null;
      v.run.delta.bombsFrame = null;
      return;
    }

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, UI_X, BOMBS_Y, color, 0, true);
  }
}

function drawPocketItemsDelta() {
  if (v.run.delta.pocketItem !== null && v.run.delta.pocketItemFrame !== null) {
    const string = v.run.delta.pocketItem.toString();
    const text = `+${string}`;

    const fade = getFade(v.run.delta.pocketItemFrame);
    if (fade <= 0) {
      v.run.delta.pocketItem = null;
      v.run.delta.pocketItemFrame = null;
      return;
    }

    const color = getTextColor(fade);
    const bottomRightPos = getScreenBottomRightPos();
    const x = bottomRightPos.X - BOTTOM_CORNER_OFFSET;
    const y = bottomRightPos.Y - BOTTOM_CORNER_OFFSET;
    g.fonts.pf.DrawString(text, x, y, color, 0, true);
  }
}

function drawTrinketsDelta() {
  if (v.run.delta.trinket !== null && v.run.delta.trinketFrame !== null) {
    const string = v.run.delta.trinket.toString();
    const text = `+${string}`;

    const fade = getFade(v.run.delta.trinketFrame);
    if (fade <= 0) {
      v.run.delta.trinket = null;
      v.run.delta.trinketFrame = null;
      return;
    }

    const color = getTextColor(fade);
    const bottomLeftPos = getScreenBottomLeftPos();
    const x = bottomLeftPos.X + BOTTOM_CORNER_OFFSET;
    const y = bottomLeftPos.Y - BOTTOM_CORNER_OFFSET;
    g.fonts.pf.DrawString(text, x, y, color, 0, true);
  }
}

function getFade(frame: int) {
  const gameFrameCount = g.g.GetFrameCount();
  const elapsedFrames = gameFrameCount - frame;

  if (elapsedFrames <= FRAMES_BEFORE_FADE) {
    return 1;
  }

  const fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE;
  return 1 - 0.02 * fadeFrames;
}

function getTextColor(fade: float) {
  return KColor(0, 0.75, 0, fade);
}

// ModCallbacks.MC_USE_CARD (5)
// Card.CARD_JUSTICE (9)
export function useCardJustice(player: EntityPlayer): void {
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
  let closestDistance = math.huge;
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

    if (closestPickup === null) {
      closestPickup = pickup;
      continue;
    }

    const distance = entity.Position.Distance(pickup.Position);
    if (distance < closestDistance) {
      closestPickup = pickup;
      closestDistance = distance;
    }
  }

  return closestPickup;
}

// ModCallbacks.MC_POST_PICKUP_INIT (34)
export function postPickupInit(pickup: EntityPickup): void {
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

function insertPickupAndUpdateDelta(
  pickup: EntityPickup,
  player: EntityPlayer,
) {
  // Some pickups cannot be automatically inserted
  const pickupInserted = insertPickup(pickup, player);
  if (pickupInserted !== undefined) {
    // Only remove the pickup if it has been successfully inserted
    pickup.Remove();

    // Track what it inserted so that we can display it on the UI
    updateDelta(player, pickupInserted);
  }
}

function updateDelta(
  player: EntityPlayer,
  pickupInserted: [PickupVariant, int],
) {
  const gameFrameCount = g.g.GetFrameCount();

  // Determining where to draw the UI indicators for players other than the first player is too
  // difficult, so ignore this case
  if (!isFirstPlayer(player)) {
    return;
  }

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

  // First, check to see if this is our 3rd Spun item so that we can insert the pill
  checkIfThirdSpunItem(collectibleType, player);

  // Check to see if this pickup drops anything
  const pickupVariants = COLLECTIBLE_TO_PICKUP_DROPS_MAP.get(collectibleType);
  if (pickupVariants === undefined) {
    return;
  }

  // This item drops pickups, so record what we expect to spawn, and then wait for later
  for (const pickupVariant of pickupVariants) {
    const playerIndex = getPlayerIndex(player);
    const queueArray: [PickupVariant, PlayerIndex] = [
      pickupVariant,
      playerIndex,
    ];
    v.room.pickupQueue.push(queueArray);
  }
}

function checkIfThirdSpunItem(
  collectibleType: CollectibleType,
  player: EntityPlayer,
) {
  const isSpunItem = collectibleHasTag(collectibleType, ItemConfigTag.SYRINGE);
  if (!isSpunItem) {
    return;
  }

  const hasSpunTransformation = player.HasPlayerForm(
    PlayerForm.PLAYERFORM_DRUGS,
  );
  if (hasSpunTransformation) {
    return;
  }

  const numSpunCollectibles = getPlayerNumTransformationCollectibles(
    player,
    PlayerForm.PLAYERFORM_DRUGS,
  );
  if (numSpunCollectibles === 2) {
    // We already have two Spun items and we are picking up a third one
    const playerIndex = getPlayerIndex(player);
    const queueArray: [PickupVariant, PlayerIndex] = [
      PickupVariant.PICKUP_PILL,
      playerIndex,
    ];
    v.room.pickupQueue.push(queueArray);
  }
}
