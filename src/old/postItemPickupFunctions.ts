// These functions are used to deposit items directly in the player's inventory, if there is room

import { ChallengeCustom } from "./challenges/enums";
import { ZERO_VECTOR } from "./constants";
import g from "./globals";
import * as misc from "./misc";
import * as postItemPickup from "./postItemPickup";
import { CollectibleTypeCustom } from "./types/enums";

const functionMap = new Map<CollectibleType, () => void>();
export default functionMap;

// 75
functionMap.set(
  CollectibleType.COLLECTIBLE_PHD,
  postItemPickup.insertNearestPill,
);

// 141
functionMap.set(CollectibleType.COLLECTIBLE_PAGEANT_BOY, () => {
  for (let i = 0; i < 7; i++) {
    // Pageant Boy drops 7 coins
    postItemPickup.insertNearestCoin();
  }
});

// 194
functionMap.set(
  CollectibleType.COLLECTIBLE_MAGIC_8_BALL,
  postItemPickup.insertNearestCard,
);

// 195
functionMap.set(
  CollectibleType.COLLECTIBLE_MOMS_COIN_PURSE,
  postItemPickup.insertNearestPill,
);

// 198
functionMap.set(CollectibleType.COLLECTIBLE_BOX, () => {
  postItemPickup.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
  postItemPickup.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
  postItemPickup.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
  postItemPickup.insertNearestCardPill();
  postItemPickup.insertNearestCardPill();
  postItemPickup.insertNearestTrinket();
  // (we ignore the heart)
});

// 251
functionMap.set(
  CollectibleType.COLLECTIBLE_STARTER_DECK,
  postItemPickup.insertNearestCard,
);

// 252
functionMap.set(
  CollectibleType.COLLECTIBLE_LITTLE_BAGGY,
  postItemPickup.insertNearestPill,
);

// 340
// Caffeine Pill is unique in that it will already insert the pill into the player's inventory
// Change the behavior such that given pill will not replace your current card/pill
functionMap.set(CollectibleType.COLLECTIBLE_CAFFEINE_PILL, () => {
  // Local variables
  const pill1 = g.p.GetPill(0); // Returns 0 if no pill

  // Find the first pill or card on the ground that is freshly spawned
  let droppedPickup = postItemPickup.getNearestPickup(
    PickupVariant.PICKUP_PILL,
  );
  if (droppedPickup === null) {
    droppedPickup = postItemPickup.getNearestPickup(
      PickupVariant.PICKUP_TAROTCARD,
    );
  }
  if (droppedPickup === null) {
    return;
  }

  // Directly overwrite the pill from Caffeine Pill (the given pill will always go to slot 1)
  if (droppedPickup.Variant === PickupVariant.PICKUP_PILL) {
    g.p.SetPill(0, droppedPickup.SubType);
  } else if (droppedPickup.Variant === PickupVariant.PICKUP_TAROTCARD) {
    g.p.SetCard(0, droppedPickup.SubType);
  }
  droppedPickup.Remove();

  // Drop the pill given from Caffeine Pill
  // (we spawn it instead of using "player.DropPoketItem()" to avoid the complexity of having two
  // slots)
  const pos = g.r.FindFreePickupSpawnPosition(g.p.Position, 1, true);
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_PILL,
    pill1,
    pos,
    ZERO_VECTOR,
    g.p,
  );
});

// 343
functionMap.set(CollectibleType.COLLECTIBLE_LATCH_KEY, () => {
  for (let i = 0; i < 2; i++) {
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_KEY);
  }
});

// 344
functionMap.set(CollectibleType.COLLECTIBLE_MATCH_BOOK, () => {
  for (let i = 0; i < 3; i++) {
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_BOMB);
  }
});

// 354
functionMap.set(
  CollectibleType.COLLECTIBLE_CRACK_JACKS,
  postItemPickup.insertNearestTrinket,
);

// 376
functionMap.set(CollectibleType.COLLECTIBLE_RESTOCK, () => {
  for (let i = 0; i < 3; i++) {
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
    postItemPickup.insertNearestCardPill();
    postItemPickup.insertNearestTrinket();
  }
});

// 402
functionMap.set(CollectibleType.COLLECTIBLE_CHAOS, () => {
  for (let i = 0; i < 6; i++) {
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_COIN); // 20
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_KEY); // 30
    postItemPickup.insertNearestPickup(PickupVariant.PICKUP_BOMB); // 40
    postItemPickup.insertNearestCardPill();
    postItemPickup.insertNearestTrinket();
  }
});

// 451
functionMap.set(
  CollectibleType.COLLECTIBLE_TAROT_CLOTH,
  postItemPickup.insertNearestCard,
);

// 458
functionMap.set(
  CollectibleType.COLLECTIBLE_BELLY_BUTTON,
  postItemPickup.insertNearestTrinket,
);

// 455
functionMap.set(CollectibleType.COLLECTIBLE_DADS_LOST_COIN, () => {
  g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_DADS_LOST_COIN);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_DADS_LOST_COIN);
  postItemPickup.removeNearestPickup(PickupVariant.PICKUP_COIN);

  g.p.AddCollectible(
    CollectibleTypeCustom.COLLECTIBLE_DADS_LOST_COIN_CUSTOM,
    0,
    false,
  );
});

// 454
functionMap.set(
  CollectibleType.COLLECTIBLE_POLYDACTYLY,
  postItemPickup.insertNearestCardPill,
);

// 537
functionMap.set(
  CollectibleType.COLLECTIBLE_LIL_SPEWER,
  postItemPickup.insertNearestPill,
);

// 547
functionMap.set(CollectibleType.COLLECTIBLE_DIVORCE_PAPERS, () => {
  // Local variables
  const challenge = Isaac.GetChallenge();

  g.itemPool.RemoveTrinket(TrinketType.TRINKET_MYSTERIOUS_PAPER);
  if (
    challenge === ChallengeCustom.R7_SEASON_8 &&
    g.season8.touchedTrinkets.includes(TrinketType.TRINKET_MYSTERIOUS_PAPER)
  ) {
    postItemPickup.removeNearestTrinket();
    return;
  }
  postItemPickup.insertNearestTrinket();
});
