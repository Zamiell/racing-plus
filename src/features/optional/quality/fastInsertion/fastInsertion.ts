// These functions are used to deposit items directly in the player's inventory, if there is room
import g from "../../../../globals";
import * as fastInsertionFunctions from "./fastInsertionFunctions";

const functionMap = new Map<CollectibleType | TrinketType, () => void>();
export default functionMap;

// 75
functionMap.set(
  CollectibleType.COLLECTIBLE_PHD,
  fastInsertionFunctions.insertNearestPill,
);

// 141
functionMap.set(CollectibleType.COLLECTIBLE_PAGEANT_BOY, () => {
  for (let i = 0; i < 7; i++) {
    // Pageant Boy drops 7 random coins
    fastInsertionFunctions.insertNearestCoin();
  }
});

// 194
functionMap.set(
  CollectibleType.COLLECTIBLE_MAGIC_8_BALL,
  fastInsertionFunctions.insertNearestCard,
);

// 195
functionMap.set(
  CollectibleType.COLLECTIBLE_MOMS_COIN_PURSE,
  fastInsertionFunctions.insertNearestPill,
);

// 198
functionMap.set(CollectibleType.COLLECTIBLE_BOX, () => {
  fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
  fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
  fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
  fastInsertionFunctions.insertNearestCardPill();
  fastInsertionFunctions.insertNearestCardPill();
  fastInsertionFunctions.insertNearestTrinket();
  // (we ignore the heart)
});

// 251
functionMap.set(
  CollectibleType.COLLECTIBLE_STARTER_DECK,
  fastInsertionFunctions.insertNearestCard,
);

// 252
functionMap.set(
  CollectibleType.COLLECTIBLE_LITTLE_BAGGY,
  fastInsertionFunctions.insertNearestPill,
);

// 263
functionMap.set(
  CollectibleType.COLLECTIBLE_CLEAR_RUNE,
  fastInsertionFunctions.insertNearestCard,
);

// 340
// Caffeine Pill is unique in that it will already insert the pill into the player's inventory
// Change the behavior such that given pill will not replace your current card/pill
functionMap.set(CollectibleType.COLLECTIBLE_CAFFEINE_PILL, () => {
  const player = Isaac.GetPlayer();
  const pill1 = player.GetPill(0); // Returns 0 if no pill

  // Find the first pill or card on the ground that is freshly spawned
  let droppedPickup = fastInsertionFunctions.getNearestPickup(
    PickupVariant.PICKUP_PILL,
  );
  if (droppedPickup === null) {
    droppedPickup = fastInsertionFunctions.getNearestPickup(
      PickupVariant.PICKUP_TAROTCARD,
    );
  }
  if (droppedPickup === null) {
    return;
  }

  // Directly overwrite the pill from Caffeine Pill (the given pill will always go to slot 1)
  if (droppedPickup.Variant === PickupVariant.PICKUP_PILL) {
    player.SetPill(0, droppedPickup.SubType);
  } else if (droppedPickup.Variant === PickupVariant.PICKUP_TAROTCARD) {
    player.SetCard(0, droppedPickup.SubType);
  }
  droppedPickup.Remove();

  // Drop the pill given from Caffeine Pill
  // (we spawn it instead of using "player.DropPocketItem()" to avoid the complexity of having two
  // slots)
  const pos = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_PILL,
    pill1,
    pos,
    Vector.Zero,
    player,
  );
});

// 343
functionMap.set(CollectibleType.COLLECTIBLE_LATCH_KEY, () => {
  for (let i = 0; i < 2; i++) {
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_KEY);
  }
});

// 344
functionMap.set(CollectibleType.COLLECTIBLE_MATCH_BOOK, () => {
  for (let i = 0; i < 3; i++) {
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_BOMB);
  }
});

// 354
functionMap.set(
  CollectibleType.COLLECTIBLE_CRACK_JACKS,
  fastInsertionFunctions.insertNearestTrinket,
);

// 376
functionMap.set(CollectibleType.COLLECTIBLE_RESTOCK, () => {
  for (let i = 0; i < 3; i++) {
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
    fastInsertionFunctions.insertNearestCardPill();
    fastInsertionFunctions.insertNearestTrinket();
  }
});

// 402
functionMap.set(CollectibleType.COLLECTIBLE_CHAOS, () => {
  for (let i = 0; i < 6; i++) {
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
    fastInsertionFunctions.insertNearestCardPill();
    fastInsertionFunctions.insertNearestTrinket();
  }
});

// 451
functionMap.set(
  CollectibleType.COLLECTIBLE_TAROT_CLOTH,
  fastInsertionFunctions.insertNearestCard,
);

// 455
functionMap.set(
  CollectibleType.COLLECTIBLE_DADS_LOST_COIN,
  fastInsertionFunctions.insertNearestCoin,
);

// 454
functionMap.set(
  CollectibleType.COLLECTIBLE_POLYDACTYLY,
  fastInsertionFunctions.insertNearestCardPill,
);

// 458
functionMap.set(
  CollectibleType.COLLECTIBLE_BELLY_BUTTON,
  fastInsertionFunctions.insertNearestTrinket,
);

// 537
functionMap.set(
  CollectibleType.COLLECTIBLE_LIL_SPEWER,
  fastInsertionFunctions.insertNearestPill,
);

// 547
functionMap.set(
  CollectibleType.COLLECTIBLE_DIVORCE_PAPERS,
  fastInsertionFunctions.insertNearestTrinket,
);

// 624
functionMap.set(
  CollectibleType.COLLECTIBLE_BOOSTER_PACK,
  fastInsertionFunctions.insertNearestCard,
);

// 644
functionMap.set(CollectibleType.COLLECTIBLE_CONSOLATION_PRIZE, () => {
  for (let i = 0; i < 3; i++) {
    // Consolation Prize drops either a bomb, a key or 3 coins
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
    fastInsertionFunctions.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
  }
});

// 654
functionMap.set(
  CollectibleType.COLLECTIBLE_FALSE_PHD,
  fastInsertionFunctions.insertNearestPill,
);

// 716
functionMap.set(CollectibleType.COLLECTIBLE_KEEPERS_SACK, () => {
  for (let i = 0; i < 3; i++) {
    // Keeper's Sack drops 3 random coins
    fastInsertionFunctions.insertNearestCoin();
  }
});
