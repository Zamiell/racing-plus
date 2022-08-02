import {
  CollectibleType,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";

/**
 * We use an arbitrary value of -1 to indicate that the collectible drops either a card or a pill.
 */
export const PICKUP_VARIANT_CARD_OR_PILL = -1 as PickupVariant;

export const COLLECTIBLE_TO_PICKUP_DROPS_MAP: ReadonlyMap<
  CollectibleType,
  PickupVariant[]
> = new Map([
  [CollectibleType.PHD, [PickupVariant.PILL]], // 75
  [CollectibleType.MOMS_PURSE, [PickupVariant.TRINKET]], // 139
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
  ], // 141
  [CollectibleType.MAGIC_8_BALL, [PickupVariant.TAROT_CARD]], // 194
  [CollectibleType.MOMS_COIN_PURSE, [PickupVariant.PILL, PickupVariant.PILL]], // 195
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
  ], // 198
  [CollectibleType.STARTER_DECK, [PickupVariant.TAROT_CARD]], // 251
  [CollectibleType.LITTLE_BAGGY, [PickupVariant.PILL]], // 252
  [CollectibleType.CLEAR_RUNE, [PickupVariant.TAROT_CARD]], // 263
  [CollectibleType.CAFFEINE_PILL, [PickupVariant.PILL]], // 340
  [CollectibleType.LATCH_KEY, [PickupVariant.KEY, PickupVariant.KEY]], // 343
  [
    CollectibleType.MATCH_BOOK,
    [PickupVariant.BOMB, PickupVariant.BOMB, PickupVariant.BOMB],
  ], // 344
  [CollectibleType.CRACK_JACKS, [PickupVariant.TRINKET]], // 354
  // CollectibleType.CHAOS (402)
  // Do not automatically insert items for Chaos so that the player gets a visual on what the
  // randomly chosen pickups were. (It spawns between 1-6 random pickups.)
  [CollectibleType.TAROT_CLOTH, [PickupVariant.TAROT_CARD]], // 451
  [CollectibleType.POLYDACTYLY, [PICKUP_VARIANT_CARD_OR_PILL]], // 454
  [CollectibleType.DADS_LOST_COIN, [PickupVariant.COIN]], // 455
  [CollectibleType.BELLY_BUTTON, [PickupVariant.TRINKET]], // 458
  [CollectibleType.LIL_SPEWER, [PickupVariant.PILL]], // 537
  // CollectibleType.MARBLES (538)
  // Do not automatically insert trinkets for Marbles so that the player can pick between what they
  // want.
  [CollectibleType.DIVORCE_PAPERS, [PickupVariant.TRINKET]], // 547
  // Booster pack drops 5 cards; we can insert 1 or 2.
  [
    CollectibleType.BOOSTER_PACK,
    [PickupVariant.TAROT_CARD, PickupVariant.TAROT_CARD],
  ], // 624
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
  ], // 644
  [CollectibleType.FALSE_PHD, [PickupVariant.PILL]], // 654
  [
    CollectibleType.KEEPERS_SACK,
    [
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.COIN,
      PickupVariant.KEY,
    ],
  ], // 716
  [CollectibleType.MOMS_RING, [PickupVariant.TAROT_CARD]], // 732
]);

export const DETRIMENTAL_TRINKETS: ReadonlySet<TrinketType> = new Set([
  TrinketType.PURPLE_HEART, // 5
  TrinketType.MOMS_TOENAIL, // 16
  TrinketType.MATCH_STICK, // 41
  TrinketType.TICK, // 53
  TrinketType.FADED_POLAROID, // 69
  TrinketType.OUROBOROS_WORM, // 96
  TrinketType.M, // 138
]);
