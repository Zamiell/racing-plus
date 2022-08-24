import { CollectibleType } from "isaac-typescript-definitions";
import { getPlayers, getRandomArrayIndex } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import v from "./v";

const REPLACED_ITEM = CollectibleType.THREE_DOLLAR_BILL;
const REPLACEMENT_ITEM = CollectibleTypeCustom.THREE_DOLLAR_BILL_SEEDED;

// Listed in alphabetical order to match the wiki page.
// https://bindingofisaacrebirth.fandom.com/wiki/3_Dollar_Bill?dlcfilter=3
const THREE_DOLLAR_BILL_ITEMS: readonly CollectibleType[] = [
  CollectibleType.TWENTY_TWENTY, // 245
  CollectibleType.APPLE, // 443
  CollectibleType.BALL_OF_TAR, // 231
  CollectibleType.CONTINUUM, // 369
  CollectibleType.CRICKETS_BODY, // 224
  CollectibleType.DARK_MATTER, // 259
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.DEATHS_TOUCH, // 237
  CollectibleType.EUTHANASIA, // 496
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.FIRE_MIND, // 257
  CollectibleType.IRON_BAR, // 201
  CollectibleType.MOMS_CONTACTS, // 110
  CollectibleType.MUTANT_SPIDER, // 153
  CollectibleType.MY_REFLECTION, // 5
  CollectibleType.MYSTERIOUS_LIQUID, // 317
  CollectibleType.NUMBER_ONE, // 6
  CollectibleType.OUIJA_BOARD, // 115
  CollectibleType.PARASITOID, // 461
  CollectibleType.PROPTOSIS, // 261
  CollectibleType.RUBBER_CEMENT, // 221
  CollectibleType.SAGITTARIUS, // 306
  CollectibleType.SCORPIO, // 305
  CollectibleType.SINUS_INFECTION, // 459
  CollectibleType.SPEED_BALL, // 143
  CollectibleType.SPOON_BENDER, // 3
  CollectibleType.INNER_EYE, // 2
  CollectibleType.THE_WIZ, // 358
  CollectibleType.TOUGH_LOVE, // 150
];

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    player.HasCollectible(REPLACED_ITEM)
  ) {
    player.RemoveCollectible(REPLACED_ITEM);
    player.AddCollectible(REPLACEMENT_ITEM);

    checkApplySeeded3DollarBillItem(player);
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  for (const player of getPlayers()) {
    checkApplySeeded3DollarBillItem(player);
  }
}

function checkApplySeeded3DollarBillItem(player: EntityPlayer) {
  if (!player.HasCollectible(REPLACEMENT_ITEM)) {
    return;
  }

  if (v.run.seeded3DollarBillItem !== null) {
    player.RemoveCollectible(v.run.seeded3DollarBillItem);
  }

  const roomSeed = g.r.GetSpawnSeed();
  const initialArrayIndex = getRandomArrayIndex(
    THREE_DOLLAR_BILL_ITEMS,
    roomSeed,
  );

  // Iterate through the item array until we find an item that we do not have yet.
  let arrayIndex = initialArrayIndex;
  do {
    const collectibleType = THREE_DOLLAR_BILL_ITEMS[arrayIndex];
    if (
      collectibleType !== undefined &&
      !player.HasCollectible(collectibleType)
    ) {
      v.run.seeded3DollarBillItem = collectibleType;
      player.AddCollectible(collectibleType, 0, false);
      return;
    }

    arrayIndex++;
    if (arrayIndex >= THREE_DOLLAR_BILL_ITEMS.length) {
      arrayIndex = 0;
    }
  } while (arrayIndex !== initialArrayIndex);

  // We have every single item in the list, so do nothing.
  v.run.seeded3DollarBillItem = null;
}
