// This custom callback provides preItemPickup and postItemPickup

import * as streakText from "../features/mandatory/streakText";
import racePostItemPickup from "../features/race/callbacks/postItemPickup";
import g from "../globals";
import { getPlayerLuaTableIndex } from "../types/GlobalsRun";
import PickingUpItemDescription from "../types/PickingUpItemDescription";
import { getPlayers, getRoomIndex } from "../utilGlobals";

export function postUpdate(): void {
  for (const player of getPlayers()) {
    if (player.IsItemQueueEmpty()) {
      queueEmpty(player);
    } else {
      queueNotEmpty(player);
    }
  }
}

function queueEmpty(player: EntityPlayer) {
  const index = getPlayerLuaTableIndex(player);
  const pickingUpItemDescription = g.run.pickingUpItem.get(index);
  if (pickingUpItemDescription === undefined) {
    error(`Failed to get the item description for player: ${index}`);
  }

  // Check to see if we were picking up something on the previous frame
  if (pickingUpItemDescription.id !== CollectibleType.COLLECTIBLE_NULL) {
    postItemPickup(player, pickingUpItemDescription);
    pickingUpItemDescription.id = CollectibleType.COLLECTIBLE_NULL;
    pickingUpItemDescription.type = ItemType.ITEM_NULL;
    pickingUpItemDescription.roomIndex = 0;
  }
}

function queueNotEmpty(player: EntityPlayer) {
  const roomIndex = getRoomIndex();
  const index = getPlayerLuaTableIndex(player);
  const pickingUpItem = g.run.pickingUpItem.get(index);
  const queuedItem = player.QueuedItem.Item;

  if (queuedItem !== null && queuedItem.ID !== pickingUpItem.id) {
    // Record which item we are picking up
    pickingUpItem.id = queuedItem.ID;
    pickingUpItem.type = queuedItem.Type;
    pickingUpItem.roomIndex = roomIndex;

    preItemPickup(player, queuedItem);
  }
}

function preItemPickup(_player: EntityPlayer, queuedItem: ItemConfigItem) {
  streakText.set(queuedItem.Name);
}

function postItemPickup(
  _player: EntityPlayer,
  pickingUpItemDescription: PickingUpItemDescription,
) {
  racePostItemPickup(pickingUpItemDescription);
}
