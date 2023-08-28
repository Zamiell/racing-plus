import {
  CardType,
  CollectibleType,
  ItemConfigTag,
  ItemType,
  ModCallback,
  PickupVariant,
  PlayerForm,
  PlayerType,
} from "isaac-typescript-definitions";
import { CallbackPriority } from "isaac-typescript-definitions/dist/src/enums/CallbackPriority";
import type { PickingUpItem } from "isaacscript-common";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  PriorityCallback,
  anyPlayerHasCollectible,
  anyPlayerIs,
  collectibleHasTag,
  game,
  getClosestEntityTo,
  getPickups,
  getPlayerFromIndex,
  getPlayerIndex,
  isBethany,
  isFirstPlayer,
  isKeeper,
  newArray,
  repeat,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import {
  CARD_TYPES_THAT_DROP_ONLY_HEARTS,
  COLLECTIBLE_TO_PICKUP_DROPS_MAP,
  PICKUP_VARIANT_CARD_OR_PILL,
} from "./automaticItemInsertion/constants";
import { drawDeltas } from "./automaticItemInsertion/drawDeltas";
import { insertPickup } from "./automaticItemInsertion/insertPickup";
import type { PickupQueueEntry } from "./automaticItemInsertion/v";
import { v } from "./automaticItemInsertion/v";

export class AutomaticItemInsertion extends ConfigurableModFeature {
  configKey: keyof Config = "AutomaticItemInsertion";
  v = v;

  /** Should be after the "Show Max Familiars" feature so that the text has priority. */
  // 2
  @PriorityCallback(ModCallback.POST_RENDER, CallbackPriority.LATE)
  postRenderLate(): void {
    drawDeltas();
  }

  // 5
  @Callback(ModCallback.POST_USE_CARD)
  postUseCard(cardType: CardType, player: EntityPlayer): void {
    if (CARD_TYPES_THAT_DROP_ONLY_HEARTS.has(cardType)) {
      this.insertHeartsFromCard(player);
    }
  }

  /**
   * The `POST_PICKUP_INIT` callback fires before this one, so we cannot use the existing queue
   * system to automatically insert items. Instead, find the nearest hearts to the player.
   */
  insertHeartsFromCard(player: EntityPlayer): void {
    const hasTarotCloth = player.HasCollectible(CollectibleType.TAROT_CLOTH);
    const numHearts = hasTarotCloth ? 3 : 2;
    const pickupVariants = newArray(PickupVariant.HEART, numHearts);

    for (const pickupVariant of pickupVariants) {
      const pickup = getClosestPickupToPlayer(player, pickupVariant);
      if (pickup !== undefined) {
        insertPickupAndUpdateDelta(pickup, player);
      }
    }
  }

  /**
   * The `POST_PICKUP_INIT` callback fires before this one, so we cannot use the existing queue
   * system to automatically insert items. Instead, find the nearest coin, bomb, and key to the
   * player.
   */
  // 5
  @Callback(ModCallback.POST_USE_CARD, CardType.JUSTICE)
  postUseCardJustice(_cardType: CardType, player: EntityPlayer): void {
    const pickups = this.getPickupsFromJusticeCard(player);
    for (const pickup of pickups) {
      insertPickupAndUpdateDelta(pickup, player);
    }
  }

  getPickupsFromJusticeCard(player: EntityPlayer): EntityPickup[] {
    const hasTarotCloth = player.HasCollectible(CollectibleType.TAROT_CLOTH);
    const numEachPickup = hasTarotCloth ? 2 : 1;

    const pickupVariants: PickupVariant[] = [];
    repeat(numEachPickup, () => {
      pickupVariants.push(
        PickupVariant.COIN, // 20
        PickupVariant.KEY, // 30
      );

      const bombPickupVariant = anyPlayerIs(PlayerType.BLUE_BABY_B)
        ? PickupVariant.POOP
        : PickupVariant.BOMB;
      pickupVariants.push(bombPickupVariant);

      if (isBethany(player)) {
        pickupVariants.push(PickupVariant.HEART);
      }
    });

    const pickups: EntityPickup[] = [];
    for (const pickupVariant of pickupVariants) {
      const pickup = getClosestPickupToPlayer(player, pickupVariant);
      if (pickup !== undefined) {
        pickups.push(pickup);
      }
    }

    return pickups;
  }

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    this.checkIfExpectingPickupDrop(pickup);
  }

  checkIfExpectingPickupDrop(pickup: EntityPickup): void {
    const index = this.findMatchingPickupQueueIndex(pickup);
    if (index === undefined) {
      return;
    }

    const pickupQueueEntry = v.room.pickupQueue[index];
    if (pickupQueueEntry === undefined) {
      return;
    }

    const { playerIndex } = pickupQueueEntry;
    const player = getPlayerFromIndex(playerIndex);
    if (player === undefined) {
      return;
    }

    insertPickupAndUpdateDelta(pickup, player);
    v.room.pickupQueue.splice(index, 1);
  }

  findMatchingPickupQueueIndex(pickup: EntityPickup): int | undefined {
    const index = v.room.pickupQueue.findIndex((pickupQueueEntry) => {
      const { pickupVariant, playerIndex } = pickupQueueEntry;
      const player = getPlayerFromIndex(playerIndex);
      if (player === undefined) {
        return false;
      }

      const effectivePickupVariant = this.getEffectivePickupVariant(
        pickup,
        pickupVariant,
      );
      return effectivePickupVariant === pickup.Variant;
    });

    return index === -1 ? undefined : index;
  }

  /**
   * The pickup that an item normally drops may not be the pickup that we should be looking to
   * automatically insert.
   *
   * Perform a conversion if necessary.
   */
  getEffectivePickupVariant(
    pickup: EntityPickup,
    lookingForPickupVariant: PickupVariant,
  ): PickupVariant {
    // Other players can change the drops.
    const hasStarterDeck = anyPlayerHasCollectible(
      CollectibleType.STARTER_DECK,
    );
    const hasLittleBaggy = anyPlayerHasCollectible(
      CollectibleType.LITTLE_BAGGY,
    );

    if (
      lookingForPickupVariant === PICKUP_VARIANT_CARD_OR_PILL &&
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

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(player: EntityPlayer, pickingUpItem: PickingUpItem): void {
    if (
      pickingUpItem.itemType === ItemType.NULL ||
      pickingUpItem.itemType === ItemType.TRINKET
    ) {
      return;
    }

    automaticItemInsertionCheckIfCollectibleDropsPickups(
      player,
      pickingUpItem.subType,
    );
  }
}

function getClosestPickupToPlayer(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
) {
  const pickups = getPickups(pickupVariant);
  const filteredPickups = pickups.filter(
    (pickup) =>
      pickup.Price === 0 &&
      // We set the vanilla "Touched" property to true if we have already inserted this pickup.
      !pickup.Touched &&
      !pickup.GetSprite().IsPlaying("Collect"),
  );

  return getClosestEntityTo(player, filteredPickups);
}

function insertPickupAndUpdateDelta(
  pickup: EntityPickup,
  player: EntityPlayer,
) {
  const hearts = player.GetHearts();

  // Some pickups cannot be automatically inserted.
  const pickupInserted = insertPickup(pickup, player);
  if (pickupInserted !== undefined) {
    // Mark that we are removing this pickup by hijacking the vanilla "Touched" property. This is
    // necessary for inserting multiple pickups from the UseCard callback.
    pickup.Touched = true;

    // Only remove the pickup if it has been successfully inserted.
    pickup.Remove();

    // Track what it inserted so that we can display it on the UI.
    updateDelta(player, pickupInserted, hearts);
  }
}

function updateDelta(
  player: EntityPlayer,
  pickupInserted: [PickupVariant, int],
  oldHearts: int,
) {
  const gameFrameCount = game.GetFrameCount();

  // Determining where to draw the UI indicators for players other than the first player is too
  // difficult, so ignore this case.
  if (!isFirstPlayer(player)) {
    return;
  }

  const [pickupType, value] = pickupInserted;
  switch (pickupType) {
    case PickupVariant.HEART: {
      if (v.run.delta.bloodOrSoulCharge === null) {
        v.run.delta.bloodOrSoulCharge = 0;
      }
      v.run.delta.bloodOrSoulCharge += value;
      v.run.delta.bloodOrSoulChargeFrame = gameFrameCount;

      return;
    }

    case PickupVariant.COIN: {
      const hearts = player.GetHearts();
      const heartDelta = hearts - oldHearts;
      if (isKeeper(player) && heartDelta > 0) {
        // The coin that we just inserted healed Keeper by one or more coin containers.
        return;
      }

      if (v.run.delta.coins === null) {
        v.run.delta.coins = 0;
      }
      v.run.delta.coins += value;
      v.run.delta.coinsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.BOMB: {
      if (v.run.delta.bombs === null) {
        v.run.delta.bombs = 0;
      }
      v.run.delta.bombs += value;
      v.run.delta.bombsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.KEY: {
      if (v.run.delta.keys === null) {
        v.run.delta.keys = 0;
      }
      v.run.delta.keys += value;
      v.run.delta.keysFrame = gameFrameCount;

      return;
    }

    case PickupVariant.TAROT_CARD:
    case PickupVariant.PILL: {
      if (v.run.delta.pocketItem === null) {
        v.run.delta.pocketItem = 0;
      }
      v.run.delta.pocketItem += value;
      v.run.delta.pocketItemFrame = gameFrameCount;

      return;
    }

    case PickupVariant.TRINKET: {
      if (v.run.delta.trinket === null) {
        v.run.delta.trinket = 0;
      }
      v.run.delta.trinket += value;
      v.run.delta.trinketFrame = gameFrameCount;

      return;
    }

    // eslint-disable-next-line isaacscript/require-break
    default: {
      error(
        `Unknown pickup variant of "${pickupType}" in the updateDelta function.`,
      );
    }
  }
}

export function automaticItemInsertionCheckIfCollectibleDropsPickups(
  player: EntityPlayer,
  collectibleType: CollectibleType,
): void {
  // First, check to see if this is our 3rd Spun item so that we can insert the pill.
  checkIfThirdSpunItem(collectibleType, player);

  // Check to see if this pickup drops anything.
  const pickupVariants = COLLECTIBLE_TO_PICKUP_DROPS_MAP.get(collectibleType);
  if (pickupVariants === undefined) {
    return;
  }

  // This item drops pickups, so record what we expect to spawn, and then wait for later.
  for (const pickupVariant of pickupVariants) {
    const playerIndex = getPlayerIndex(player);
    const pickupQueueEntry: PickupQueueEntry = {
      pickupVariant,
      playerIndex,
    };
    v.room.pickupQueue.push(pickupQueueEntry);
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

  const hasSpunTransformation = player.HasPlayerForm(PlayerForm.SPUN);
  if (hasSpunTransformation) {
    return;
  }

  const spunCollectibles = mod.getPlayerCollectiblesForTransformation(
    player,
    PlayerForm.SPUN,
  );
  if (spunCollectibles.length === 2) {
    // We already have two Spun items and we are picking up a third one.
    const playerIndex = getPlayerIndex(player);
    const pickupQueueEntry = {
      pickupVariant: PickupVariant.PILL,
      playerIndex,
    } as const satisfies PickupQueueEntry;
    v.room.pickupQueue.push(pickupQueueEntry);
  }
}
