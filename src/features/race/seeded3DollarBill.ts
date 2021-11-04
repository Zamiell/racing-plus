import {
  getPlayers,
  getRandomInt,
  PickingUpItem,
  removeItemFromItemTracker,
} from "isaacscript-common";
import g from "../../globals";
import { CollectibleTypeCustom } from "../../types/enums";
import RaceFormat from "./types/RaceFormat";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";
import v from "./v";

const REPLACED_ITEM = CollectibleType.COLLECTIBLE_3_DOLLAR_BILL;
const REPLACEMENT_ITEM = CollectibleTypeCustom.COLLECTIBLE_3_DOLLAR_BILL_SEEDED;

// Listed in alphabetical order to match the wiki page
// https://bindingofisaacrebirth.fandom.com/wiki/3_Dollar_Bill?dlcfilter=3
const THREE_DOLLAR_BILL_ITEMS: CollectibleType[] = [
  CollectibleType.COLLECTIBLE_20_20, // 245
  CollectibleType.COLLECTIBLE_APPLE, // 443
  CollectibleType.COLLECTIBLE_BALL_OF_TAR, // 231
  CollectibleType.COLLECTIBLE_CONTINUUM, // 369
  CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
  CollectibleType.COLLECTIBLE_DARK_MATTER, // 259
  CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
  CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
  CollectibleType.COLLECTIBLE_EUTHANASIA, // 496
  CollectibleType.COLLECTIBLE_EYE_OF_BELIAL, // 462
  CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
  CollectibleType.COLLECTIBLE_IRON_BAR, // 201
  CollectibleType.COLLECTIBLE_MOMS_CONTACTS, // 110
  CollectibleType.COLLECTIBLE_MUTANT_SPIDER, // 153
  CollectibleType.COLLECTIBLE_MY_REFLECTION, // 5
  CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID, // 317
  CollectibleType.COLLECTIBLE_NUMBER_ONE, // 6
  CollectibleType.COLLECTIBLE_OUIJA_BOARD, // 115
  CollectibleType.COLLECTIBLE_PARASITOID, // 461
  CollectibleType.COLLECTIBLE_PROPTOSIS, // 261
  CollectibleType.COLLECTIBLE_RUBBER_CEMENT, // 221
  CollectibleType.COLLECTIBLE_SAGITTARIUS, // 306
  CollectibleType.COLLECTIBLE_SCORPIO, // 305
  CollectibleType.COLLECTIBLE_SINUS_INFECTION, // 459
  CollectibleType.COLLECTIBLE_SPEED_BALL, // 143
  CollectibleType.COLLECTIBLE_SPOON_BENDER, // 3
  CollectibleType.COLLECTIBLE_INNER_EYE, // 2
  CollectibleType.COLLECTIBLE_THE_WIZ, // 358
  CollectibleType.COLLECTIBLE_TOUGH_LOVE, // 150
];

export function postNewRoom(): void {
  for (const player of getPlayers()) {
    checkApplySeeded3DollarBillItem(player);
  }
}

function checkApplySeeded3DollarBillItem(player: EntityPlayer) {
  if (!player.HasCollectible(REPLACEMENT_ITEM)) {
    return;
  }

  const roomSeed = g.r.GetSpawnSeed();

  if (v.run.seeded3DollarBillItem !== null) {
    player.RemoveCollectible(v.run.seeded3DollarBillItem);
    removeItemFromItemTracker(v.run.seeded3DollarBillItem);
  }

  const initialArrayIndex = getRandomInt(
    0,
    THREE_DOLLAR_BILL_ITEMS.length - 1,
    roomSeed,
  );

  // Iterate through the item array until we find an item that we do not have yet
  let arrayIndex = initialArrayIndex;
  do {
    const collectibleType = THREE_DOLLAR_BILL_ITEMS[arrayIndex];
    if (!player.HasCollectible(collectibleType)) {
      v.run.seeded3DollarBillItem = collectibleType;
      player.AddCollectible(collectibleType, 0, false);
      return;
    }

    arrayIndex += 1;
    if (arrayIndex >= THREE_DOLLAR_BILL_ITEMS.length) {
      arrayIndex = 0;
    }
  } while (arrayIndex !== initialArrayIndex);

  // We have every single item in the list, so do nothing
  v.run.seeded3DollarBillItem = null;
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
export function postItemPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  // Check to see if we picked up the item that conflicts with the custom 3 Dollar Bill
  if (
    player.HasCollectible(REPLACEMENT_ITEM) &&
    pickingUpItem.type === ItemType.ITEM_PASSIVE &&
    pickingUpItem.id === v.run.seeded3DollarBillItem
  ) {
    // Unset the variable so that the new item does not get blown away after a room change
    v.run.seeded3DollarBillItem = null;
  }
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
// CollectibleType.COLLECTIBLE_3_DOLLAR_BILL (191)
export function postItemPickup3DollarBill(player: EntityPlayer): void {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    player.HasCollectible(REPLACED_ITEM)
  ) {
    player.RemoveCollectible(REPLACED_ITEM);
    removeItemFromItemTracker(REPLACED_ITEM);
    player.AddCollectible(REPLACEMENT_ITEM);

    checkApplySeeded3DollarBillItem(player);
  }
}
