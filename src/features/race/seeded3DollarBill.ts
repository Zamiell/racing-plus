import { CollectibleType } from "isaac-typescript-definitions";
import { game, getPlayers, getRandomArrayIndex } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import { v } from "./v";

const OLD_COLLECTIBLE_TYPE = CollectibleType.THREE_DOLLAR_BILL;
const NEW_COLLECTIBLE_TYPE = CollectibleTypeCustom.THREE_DOLLAR_BILL_SEEDED;

// Listed in alphabetical order to match the wiki page (39 in total).
// https://bindingofisaacrebirth.fandom.com/wiki/3_Dollar_Bill?dlcfilter=3
const THREE_DOLLAR_BILL_ITEMS = [
  CollectibleType.EIGHT_INCH_NAILS,
  CollectibleType.TWENTY_TWENTY,
  CollectibleType.APPLE,
  CollectibleType.BALL_OF_TAR,
  CollectibleType.CONTINUUM,
  CollectibleType.CRICKETS_BODY,
  CollectibleType.DARK_MATTER,
  CollectibleType.DEAD_EYE,
  CollectibleType.DEATHS_TOUCH,
  CollectibleType.EUTHANASIA,
  CollectibleType.EXPLOSIVO,
  CollectibleType.EYE_OF_BELIAL,
  CollectibleType.FIRE_MIND,
  CollectibleType.HOLY_LIGHT,
  CollectibleType.IRON_BAR,
  CollectibleType.LITTLE_HORN,
  CollectibleType.LOST_CONTACT,
  CollectibleType.MOMS_CONTACTS,
  CollectibleType.MOMS_EYESHADOW,
  CollectibleType.MOMS_PERFUME,
  CollectibleType.MUTANT_SPIDER,
  CollectibleType.MY_REFLECTION,
  CollectibleType.MYSTERIOUS_LIQUID,
  CollectibleType.NUMBER_ONE,
  CollectibleType.OUIJA_BOARD,
  CollectibleType.PARASITOID,
  CollectibleType.PROPTOSIS,
  CollectibleType.PUPULA_DUPLEX,
  CollectibleType.RUBBER_CEMENT,
  CollectibleType.SAGITTARIUS,
  CollectibleType.SCORPIO,
  CollectibleType.SINUS_INFECTION,
  CollectibleType.SPEED_BALL,
  CollectibleType.SPOON_BENDER,
  CollectibleType.INNER_EYE,
  CollectibleType.PARASITE,
  CollectibleType.SAD_ONION,
  CollectibleType.WIZ,
  CollectibleType.TOUGH_LOVE,
] as const;

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    player.HasCollectible(OLD_COLLECTIBLE_TYPE, true)
  ) {
    player.RemoveCollectible(OLD_COLLECTIBLE_TYPE);
    player.AddCollectible(NEW_COLLECTIBLE_TYPE);

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
  if (!player.HasCollectible(NEW_COLLECTIBLE_TYPE)) {
    return;
  }

  if (v.run.seeded3DollarBillItem !== null) {
    player.RemoveCollectible(v.run.seeded3DollarBillItem);
  }

  const room = game.GetRoom();
  const roomSeed = room.GetSpawnSeed();
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
