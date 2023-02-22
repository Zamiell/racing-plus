import {
  CollectibleType,
  ItemConfigTag,
  ItemType,
  PickupVariant,
  PlayerForm,
} from "isaac-typescript-definitions";
import {
  collectibleHasTag,
  getPlayerIndex,
  PickingUpItem,
} from "isaacscript-common";
import { mod } from "../../../../../mod";
import { config } from "../../../../../modConfigMenu";
import { COLLECTIBLE_TO_PICKUP_DROPS_MAP } from "../constants";
import { PickupQueueEntry, v } from "../v";

export function automaticItemInsertionPreItemPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  if (!config.AutomaticItemInsertion) {
    return;
  }

  checkIfItemDropsPickups(player, pickingUpItem);
}

function checkIfItemDropsPickups(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
) {
  if (
    pickingUpItem.itemType === ItemType.NULL ||
    pickingUpItem.itemType === ItemType.TRINKET
  ) {
    return;
  }

  const collectibleType = pickingUpItem.subType;

  // First, check to see if this is our 3rd Spun item so that we can insert the pill.
  checkIfThirdSpunItem(collectibleType, player);

  // Check to see if this pickup drops anything.
  const pickupVariants = COLLECTIBLE_TO_PICKUP_DROPS_MAP.get(collectibleType);
  if (pickupVariants === undefined) {
    return;
  }

  // This item drops pickups, so record what we expect to spawn, and then wait for later.
  for (const pickupVariant of pickupVariants) {
    const playerIndex = getPlayerIndex(player);
    const pickupQueueEntry = {
      pickupVariant,
      playerIndex,
    } as const satisfies PickupQueueEntry;
    v.room.pickupQueue.push(pickupQueueEntry);
  }
}

function checkIfThirdSpunItem(
  collectibleType: CollectibleType,
  player: EntityPlayer,
) {
  const isSpunItem = collectibleHasTag(collectibleType, ItemConfigTag.SYRINGE);
  if (!isSpunItem) {
    return;
  }

  const hasSpunTransformation = player.HasPlayerForm(PlayerForm.SPUN);
  if (hasSpunTransformation) {
    return;
  }

  const spunCollectibles = mod.getPlayerCollectiblesForTransformation(
    player,
    PlayerForm.SPUN,
  );
  if (spunCollectibles.length === 2) {
    // We already have two Spun items and we are picking up a third one.
    const playerIndex = getPlayerIndex(player);
    const pickupQueueEntry = {
      pickupVariant: PickupVariant.PILL,
      playerIndex,
    } as const satisfies PickupQueueEntry;
    v.room.pickupQueue.push(pickupQueueEntry);
  }
}
