export const PICKUP_VARIANT_CARD_OR_PILL = -1;

export const COLLECTIBLE_TO_PICKUP_DROPS_MAP = new Map<
  CollectibleType,
  PickupVariant[]
>([
  [CollectibleType.COLLECTIBLE_PHD, [PickupVariant.PICKUP_PILL]], // 75
  [CollectibleType.COLLECTIBLE_MOMS_PURSE, [PickupVariant.PICKUP_TRINKET]], // 139
  [
    CollectibleType.COLLECTIBLE_PAGEANT_BOY,
    [
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
    ],
  ], // 141
  [CollectibleType.COLLECTIBLE_MAGIC_8_BALL, [PickupVariant.PICKUP_TAROTCARD]], // 194
  [
    CollectibleType.COLLECTIBLE_MOMS_COIN_PURSE,
    [PickupVariant.PICKUP_PILL, PickupVariant.PICKUP_PILL],
  ], // 195
  [
    CollectibleType.COLLECTIBLE_BOX,
    [
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_KEY,
      PickupVariant.PICKUP_BOMB,
      PickupVariant.PICKUP_TAROTCARD,
      PickupVariant.PICKUP_PILL,
      PickupVariant.PICKUP_TRINKET,
    ],
  ], // 198
  [CollectibleType.COLLECTIBLE_STARTER_DECK, [PickupVariant.PICKUP_TAROTCARD]], // 251
  [CollectibleType.COLLECTIBLE_LITTLE_BAGGY, [PickupVariant.PICKUP_PILL]], // 252
  [CollectibleType.COLLECTIBLE_CLEAR_RUNE, [PickupVariant.PICKUP_TAROTCARD]], // 263
  [CollectibleType.COLLECTIBLE_CAFFEINE_PILL, [PickupVariant.PICKUP_PILL]], // 340
  [
    CollectibleType.COLLECTIBLE_LATCH_KEY,
    [PickupVariant.PICKUP_KEY, PickupVariant.PICKUP_KEY],
  ], // 343
  [
    CollectibleType.COLLECTIBLE_MATCH_BOOK,
    [
      PickupVariant.PICKUP_BOMB,
      PickupVariant.PICKUP_BOMB,
      PickupVariant.PICKUP_BOMB,
    ],
  ], // 344
  [CollectibleType.COLLECTIBLE_CRACK_JACKS, [PickupVariant.PICKUP_TRINKET]], // 354
  // CollectibleType.COLLECTIBLE_CHAOS (402)
  // Do not automatically insert items for Chaos so that the player gets a visual on what the
  // randomly chosen pickups were (it spawns between 1-6 random pickups)
  [CollectibleType.COLLECTIBLE_TAROT_CLOTH, [PickupVariant.PICKUP_TAROTCARD]], // 451
  [CollectibleType.COLLECTIBLE_POLYDACTYLY, [PICKUP_VARIANT_CARD_OR_PILL]], // 454
  [CollectibleType.COLLECTIBLE_DADS_LOST_COIN, [PickupVariant.PICKUP_COIN]], // 455
  [CollectibleType.COLLECTIBLE_BELLY_BUTTON, [PickupVariant.PICKUP_TRINKET]], // 458
  [CollectibleType.COLLECTIBLE_LIL_SPEWER, [PickupVariant.PICKUP_PILL]], // 537
  // CollectibleType.COLLECTIBLE_MARBLES (538)
  // Do not automatically insert trinkets for Marbles so that the player can pick between what they
  // want
  [CollectibleType.COLLECTIBLE_DIVORCE_PAPERS, [PickupVariant.PICKUP_TRINKET]], // 547
  // Booster pack drops 5 cards; we can insert 1 or 2
  [
    CollectibleType.COLLECTIBLE_BOOSTER_PACK,
    [PickupVariant.PICKUP_TAROTCARD, PickupVariant.PICKUP_TAROTCARD],
  ], // 624
  // Consolation Prize drops either 3 coins, 1 key, or 1 bomb,
  // depending on what the player has the least of
  // However, if there is a tie, it will randomly choose an outcome,
  // so we must manually check for all 5 drops
  [
    CollectibleType.COLLECTIBLE_CONSOLATION_PRIZE,
    [
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_BOMB,
      PickupVariant.PICKUP_KEY,
    ],
  ], // 644
  [CollectibleType.COLLECTIBLE_FALSE_PHD, [PickupVariant.PICKUP_PILL]], // 654
  [
    CollectibleType.COLLECTIBLE_KEEPERS_SACK,
    [
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
      PickupVariant.PICKUP_COIN,
    ],
  ], // 716
]);

export const DETRIMENTAL_TRINKETS = [
  TrinketType.TRINKET_PURPLE_HEART, // 5
  TrinketType.TRINKET_MOMS_TOENAIL, // 16
  TrinketType.TRINKET_MATCH_STICK, // 41
  TrinketType.TRINKET_TICK, // 53
  TrinketType.TRINKET_FADED_POLAROID, // 69
  TrinketType.TRINKET_OUROBOROS_WORM, // 96
  TrinketType.TRINKET_M, // 138
];

export const UI_X = 35;
export const COINS_X_OFFSET = 10; // For Deep Pockets
export const COINS_Y = 33;
const yOffset = 12;
export const BOMBS_Y = COINS_Y + yOffset;
export const KEYS_Y = BOMBS_Y + yOffset;
export const FRAMES_BEFORE_FADE = 100;
export const BOTTOM_CORNER_OFFSET = 40;
