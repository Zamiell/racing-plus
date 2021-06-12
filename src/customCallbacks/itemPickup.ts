// This custom callback provides preItemPickup and postItemPickup

import * as streakText from "../features/mandatory/streakText";
import g from "../globals";
import { getPlayers, getRoomIndex } from "../misc";
import { getPlayerLuaTableIndex } from "../types/GlobalsRun";

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
  const pickingUpItem = g.run.pickingUpItem.get(index);

  // Check to see if we were picking up something on the previous frame
  if (pickingUpItem.id !== CollectibleType.COLLECTIBLE_NULL) {
    pickingUpItem.id = 0;
    postItemPickup(player);
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

    preItemPickup(queuedItem);
  }
}

function preItemPickup(queuedItem: ItemConfigItem) {
  streakText.set(queuedItem.Name);
}

function postItemPickup(_player: EntityPlayer) {}
