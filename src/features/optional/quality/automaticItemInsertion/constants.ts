export const PICKUP_VARIANT_CARD_OR_PILL = -1;

export const COLLECTIBLE_TO_PICKUP_DROPS_MAP = new Map<
  CollectibleType,
  PickupVariant[]
>([
  [CollectibleType.COLLECTIBLE_PHD, [PickupVariant.PICKUP_PILL]], // 75
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
  // Do not automatically insert items for Chaos so that the player gets a visual on what the
  // randomly chosen pickups were (it spawns between 1-6 random pickups)
  [CollectibleType.COLLECTIBLE_TAROT_CLOTH, [PickupVariant.PICKUP_TAROTCARD]], // 451
  [CollectibleType.COLLECTIBLE_POLYDACTYLY, [PICKUP_VARIANT_CARD_OR_PILL]], // 454
  [CollectibleType.COLLECTIBLE_DADS_LOST_COIN, [PickupVariant.PICKUP_COIN]], // 455
  [CollectibleType.COLLECTIBLE_BELLY_BUTTON, [PickupVariant.PICKUP_TRINKET]], // 458
  [CollectibleType.COLLECTIBLE_LIL_SPEWER, [PickupVariant.PICKUP_PILL]], // 537
  [CollectibleType.COLLECTIBLE_DIVORCE_PAPERS, [PickupVariant.PICKUP_TRINKET]], // 547
]);
