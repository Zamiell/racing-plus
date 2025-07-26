import {
  CallbackPriority,
  CollectibleType,
  ModCallback,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  PriorityCallbackCustom,
  ReadonlySet,
  anyPlayerHasCollectible,
  anyPlayerIs,
  asCollectibleType,
  asNumber,
  game,
  getCollectibles,
  getPlayersOfType,
  newRNG,
  removeCollectibleFromPools,
  removeTrinketFromPools,
  setCollectibleSubType,
} from "isaacscript-common";
import { inSeededRace } from "../../../../features/race/v";
import { mod } from "../../../../mod";
import { addCollectibleAndRemoveFromPools } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import * as showEdenStartingItems from "../../optional/characters/ShowEdenStartingItems";
import { PLACEHOLDER_COLLECTIBLE_TYPES } from "../../optional/gameplay/extraStartingItems/constants";

export const BANNED_COLLECTIBLES = new ReadonlySet<CollectibleType>([
  CollectibleType.MERCURIUS, // 590
  CollectibleType.TMTRAINER, // 721
]);

const BANNED_COLLECTIBLES_WITH_VOID = new ReadonlySet<CollectibleType>([
  CollectibleType.MEGA_BLAST, // 441
  CollectibleType.MEGA_MUSH, // 625
]);

export const BANNED_TRINKETS = new ReadonlySet<TrinketType>([
  // Since all Donation Machines are removed, it has no purpose.
  TrinketType.KARMA,
]);

const BANNED_COLLECTIBLES_ON_SEEDED_RACES = new ReadonlySet<CollectibleType>([
  // It changes the selection of rooms in an unknown way, which was discovered in March 2023.
  // https://github.com/UnderscoreKilburn/repentance-issues/issues/1752
  CollectibleType.BLACK_CANDLE, // 260

  // Since drops are seeded and given in order, Glyph of Balance does not work properly.
  CollectibleType.GLYPH_OF_BALANCE, // 464

  // Since Devil Rooms and Angel Rooms are pre-determined, Duality does not work properly.
  CollectibleType.DUALITY, // 498

  // Damocles is unseeded
  CollectibleType.DAMOCLES, // 577
  CollectibleType.DAMOCLES_PASSIVE, // 656

  // Sol is mostly useless if you start with the Compass.
  CollectibleType.SOL, // 588

  // R Key allows players to play a different seed.
  CollectibleType.R_KEY, // 636

  // Options does not work properly with the seeded room drops mechanic.
  CollectibleType.OPTIONS, // 670
]);

const BANNED_TRINKETS_ON_SEEDED_RACES = new ReadonlySet<TrinketType>([
  // Cain's Eye is useless if you start with the Compass.
  TrinketType.CAINS_EYE, // 59

  // Remove certain trinkets that mess up floor generation.
  TrinketType.SILVER_DOLLAR, // 110
  TrinketType.BLOODY_CROWN, // 111
  TrinketType.TELESCOPE_LENS, // 152
  TrinketType.HOLY_CROWN, // 155
  TrinketType.WICKED_CROWN, // 161

  // Dice Bag is seeded per room entrance instead of per room.
  TrinketType.DICE_BAG, // 154

  // The game is bugged such that the collectibles granted from Modeling Clay will also be removed
  // from pools.
  TrinketType.MODELING_CLAY, // 166
]);

const v = {
  run: {
    startedWithVoid: false,
    startedWithCompass: false,
  },
};

/**
 * Racing+ removes some items from the game for various reasons.
 *
 * This feature is not configurable because it could cause a seed to be different.
 */
export class RemoveGloballyBannedItems extends MandatoryModFeature {
  v = v;

  // 3, 723
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.SPINDOWN_DICE)
  postUseItemSpindownDice(): boolean | undefined {
    for (const collectible of getCollectibles()) {
      if (isBannedCollectible(collectible)) {
        // Skip over the banned collectible and turn it into the one before that.
        const previousCollectibleType = asCollectibleType(
          asNumber(collectible.SubType) - 1,
        );
        setCollectibleSubType(collectible, previousCollectibleType);
      }
    }

    return undefined;
  }

  /**
   * This removes items from pools, so it needs to be before giving items that can spawn other items
   * (like Marbles).
   */
  @PriorityCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    CallbackPriority.EARLY,
    false,
  )
  postGameStartedReorderedFalseEarly(): void {
    this.removeBannedItemsFromPools();
  }

  removeBannedItemsFromPools(): void {
    const itemPool = game.GetItemPool();

    removeCollectibleFromPools(...BANNED_COLLECTIBLES);
    removeTrinketFromPools(...BANNED_TRINKETS);

    if (anyPlayerHasCollectible(CollectibleType.VOID)) {
      v.run.startedWithVoid = true;
      removeCollectibleFromPools(...BANNED_COLLECTIBLES_WITH_VOID);
    }

    if (inSeededRace()) {
      removeCollectibleFromPools(...BANNED_COLLECTIBLES_ON_SEEDED_RACES);
      removeTrinketFromPools(...BANNED_TRINKETS_ON_SEEDED_RACES);
    }

    // Tainted Magdalene is invincible with Sharp Plug.
    if (anyPlayerIs(PlayerType.MAGDALENE_B)) {
      itemPool.RemoveCollectible(CollectibleType.SHARP_PLUG);
    }
  }

  /** This checks for items, so it has to be after all features that grant items. */
  @PriorityCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    CallbackPriority.LATE,
    false,
  )
  postGameStartedReorderedFalseLate(): void {
    this.replaceEdenBannedItems();
  }

  /**
   * Mercurius and TMTRAINER have the "noeden" tag added in "items_metadata.xml", so we do not have
   * to worry about those.
   */
  replaceEdenBannedItems(): void {
    // The only items to worry about are the ones that are conditionally banned in seeded races.
    if (inSeededRace()) {
      return;
    }

    const edens = getPlayersOfType(PlayerType.EDEN, PlayerType.EDEN_B);
    for (const player of edens) {
      for (const collectibleType of BANNED_COLLECTIBLES_ON_SEEDED_RACES) {
        if (player.HasCollectible(collectibleType)) {
          player.RemoveCollectible(collectibleType);
          this.addNewRandomPassiveToEden(player);
        }
      }

      if (v.run.startedWithCompass) {
        this.addNewRandomPassiveToEden(player);
      }

      for (const trinketType of BANNED_TRINKETS_ON_SEEDED_RACES) {
        if (player.HasTrinket(trinketType)) {
          player.TryRemoveTrinket(trinketType);
          // (Do not reward them with a new trinket, since Eden does not always start with a
          // trinket.)
        }
      }
    }
  }

  addNewRandomPassiveToEden(player: EntityPlayer): void {
    const replacementCollectibleType =
      this.getEdenReplacementCollectibleType(player);
    showEdenStartingItems.changeStartingPassiveItem(replacementCollectibleType);
    addCollectibleAndRemoveFromPools(player, replacementCollectibleType);
  }

  getEdenReplacementCollectibleType(player: EntityPlayer): CollectibleType {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    const rng = newRNG(startSeed);

    let replacementCollectible: CollectibleType;
    do {
      replacementCollectible = mod.getRandomEdenPassiveCollectibleType(
        rng,
        PLACEHOLDER_COLLECTIBLE_TYPES,
      );
    } while (player.HasCollectible(replacementCollectible));

    return replacementCollectible;
  }

  /** Prevent getting banned items on the Death Certificate floor. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    for (const collectible of getCollectibles()) {
      if (isBannedCollectible(collectible)) {
        collectible.Remove();
      }
    }
  }
}

function isBannedCollectible(collectible: EntityPickupCollectible) {
  if (BANNED_COLLECTIBLES.has(collectible.SubType)) {
    return true;
  }

  if (
    v.run.startedWithVoid
    && BANNED_COLLECTIBLES_WITH_VOID.has(collectible.SubType)
  ) {
    return true;
  }

  if (
    inSeededRace()
    && BANNED_COLLECTIBLES_ON_SEEDED_RACES.has(collectible.SubType)
  ) {
    return true;
  }

  if (
    anyPlayerIs(PlayerType.MAGDALENE_B)
    && collectible.SubType === CollectibleType.SHARP_PLUG
  ) {
    return true;
  }

  return false;
}

export function setStartedWithCompass(): void {
  v.run.startedWithCompass = true;
}
