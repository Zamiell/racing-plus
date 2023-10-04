import {
  CardType,
  CollectibleType,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import { ReadonlyMap, ReadonlySet } from "isaacscript-common";

/**
 * We use an arbitrary value of -1 to indicate that the collectible drops either a card or a pill.
 */
export const PICKUP_VARIANT_CARD_OR_PILL = -1 as PickupVariant;

export const COLLECTIBLE_TO_PICKUP_DROPS_MAP = new ReadonlyMap<
  CollectibleType,
  PickupVariant[]
>([
  // 75
  [CollectibleType.PHD, [PickupVariant.PILL]],

  // 139
  [CollectibleType.MOMS_PURSE, [PickupVariant.TRINKET]],

  // 141
  [
    CollectibleType.PAGEANT_BOY,
    [
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
    ],
  ],

  // 194
  [CollectibleType.MAGIC_8_BALL, [PickupVariant.TAROT_CARD]],

  // 195
  [CollectibleType.MOMS_COIN_PURSE, [PickupVariant.PILL, PickupVariant.PILL]],

  // 198
  [
    CollectibleType.BOX,
    [
      PickupVariant.COIN,
      PickupVariant.KEY,
      PickupVariant.BOMB,
      PickupVariant.TAROT_CARD,
      // The Box also drops a pill, but since the pill spawns before the card does, the pill will
      // always be inserted into the players inventory over the card. To work around this and
      // prioritize the card, we deliberately skip specifying the pill here.
      PickupVariant.TRINKET,
    ],
  ],

  // 251
  [CollectibleType.STARTER_DECK, [PickupVariant.TAROT_CARD]],

  // 252
  [CollectibleType.LITTLE_BAGGY, [PickupVariant.PILL]],

  // 263
  [CollectibleType.CLEAR_RUNE, [PickupVariant.TAROT_CARD]],

  // 340
  [CollectibleType.CAFFEINE_PILL, [PickupVariant.PILL]],

  // 343
  [CollectibleType.LATCH_KEY, [PickupVariant.KEY, PickupVariant.KEY]],

  // 344
  [
    CollectibleType.MATCH_BOOK,
    [PickupVariant.BOMB, PickupVariant.BOMB, PickupVariant.BOMB],
  ],

  // 354
  [CollectibleType.CRACK_JACKS, [PickupVariant.TRINKET]],

  // 402
  // CollectibleType.CHAOS
  // Do not automatically insert items for Chaos so that the player gets a visual on what the
  // randomly chosen pickups were. (It spawns between 1-6 random pickups.)

  // 451
  [CollectibleType.TAROT_CLOTH, [PickupVariant.TAROT_CARD]],

  // 454
  [CollectibleType.POLYDACTYLY, [PICKUP_VARIANT_CARD_OR_PILL]],

  // 455
  [CollectibleType.DADS_LOST_COIN, [PickupVariant.COIN]],

  // 458
  [CollectibleType.BELLY_BUTTON, [PickupVariant.TRINKET]],

  // 537
  [CollectibleType.LIL_SPEWER, [PickupVariant.PILL]],

  // 538
  // CollectibleType.MARBLES
  // Do not automatically insert trinkets for Marbles so that the player can pick between what they
  // want.

  // 547
  [CollectibleType.DIVORCE_PAPERS, [PickupVariant.TRINKET]],

  // 624
  // Booster pack drops 5 cards; we can insert 1 or 2.
  [
    CollectibleType.BOOSTER_PACK,
    [PickupVariant.TAROT_CARD, PickupVariant.TAROT_CARD],
  ],

  // 644
  // Consolation Prize drops either 3 coins, 1 key, or 1 bomb, depending on what the player has the
  // least of. However, if there is a tie, it will randomly choose an outcome, so we must manually
  // check for all 5 drops.
  [
    CollectibleType.CONSOLATION_PRIZE,
    [
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.BOMB,
      PickupVariant.KEY,
    ],
  ],

  // 654
  [CollectibleType.FALSE_PHD, [PickupVariant.PILL]],

  // 716
  [
    CollectibleType.KEEPERS_SACK,
    [
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.KEY,
    ],
  ],

  // 732
  [CollectibleType.MOMS_RING, [PickupVariant.TAROT_CARD]],
]);

export const DETRIMENTAL_TRINKETS = new ReadonlySet<TrinketType>([
  TrinketType.PURPLE_HEART, // 5
  TrinketType.MOMS_TOENAIL, // 16
  TrinketType.MATCH_STICK, // 41
  TrinketType.TICK, // 53
  TrinketType.FADED_POLAROID, // 69
  TrinketType.OUROBOROS_WORM, // 96
  TrinketType.M, // 138
]);

export const CARD_TYPES_THAT_DROP_ONLY_HEARTS = new ReadonlySet<CardType>([
  CardType.HIEROPHANT, // 6
  CardType.LOVERS, // 7
]);
