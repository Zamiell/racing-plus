// This custom callback provides preItemPickup and postItemPickup

import g from "../globals";
import { getPlayerLuaTableIndex, getPlayers, getRoomIndex } from "../misc";

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
  drawStreakText(queuedItem.Name);
}

function postItemPickup(_player: EntityPlayer) {}

function drawStreakText(itemName: string) {
  // Mark to draw the streak text for this item
  g.run.streakText.text = itemName;
  g.run.streakText.frame = Isaac.GetFrameCount();
}
