import { getPlayers, isKeyboardPressed } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { findFreePosition } from "../../../utilGlobals";

enum FastDropTarget {
  ALL,
  TRINKETS,
  POCKET_ITEMS,
}

export function postUpdate(): void {
  // Normally, we would iterate over the players and check for inputs corresponding to their
  // ControllerIndex
  // However, some Xbox controller inputs are not read by the game,
  // which forces players to use Joy2Key to bind them to keyboard buttons
  // Thus, a player might have a ControllerIndex of 1 and be pressing inputs on ControllerIndex 0
  // Because of this, we only check for keyboard inputs,
  // and then iterate over the players if an input is pressed
  checkInputAll();
  checkInputTrinkets();
  checkInputPocket();
}

function checkInputAll() {
  if (hotkeys.fastDropAll !== -1 && isKeyboardPressed(hotkeys.fastDropAll)) {
    fastDrop(FastDropTarget.ALL);
  }
}

function checkInputTrinkets() {
  if (
    hotkeys.fastDropTrinkets !== -1 &&
    isKeyboardPressed(hotkeys.fastDropTrinkets)
  ) {
    fastDrop(FastDropTarget.TRINKETS);
  }
}

function checkInputPocket() {
  if (
    hotkeys.fastDropPocket !== -1 &&
    isKeyboardPressed(hotkeys.fastDropPocket)
  ) {
    fastDrop(FastDropTarget.POCKET_ITEMS);
  }
}

function fastDrop(target: FastDropTarget) {
  for (const player of getPlayers()) {
    // Fast-drop is disabled during when the player is holding an item above their head
    if (!player.IsItemQueueEmpty()) {
      return;
    }

    // Trinkets
    // (the Tick is handled properly because "DropTrinket()" won't do anything in that case)
    if (target === FastDropTarget.ALL || target === FastDropTarget.TRINKETS) {
      const pos1 = findFreePosition(player.Position);
      player.DropTrinket(pos1, false);
      const pos2 = findFreePosition(player.Position);
      player.DropTrinket(pos2, false);
    }

    // Pocket items (cards, pills, runes, etc.)
    if (
      target === FastDropTarget.ALL ||
      target === FastDropTarget.POCKET_ITEMS
    ) {
      const pos1 = findFreePosition(player.Position);
      player.DropPocketItem(0, pos1);
      const pos2 = findFreePosition(player.Position);
      player.DropPocketItem(1, pos2);
    }
  }
}
