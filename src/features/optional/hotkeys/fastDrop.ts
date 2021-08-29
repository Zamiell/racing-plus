import { getPlayers } from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { findFreePosition } from "../../../utilGlobals";

enum FastDropTarget {
  ALL,
  TRINKETS,
  POCKET_ITEMS,
}

export function postUpdate(): void {
  // Don't conditionally disable this feature because there are too many booleans to check
  checkInput();
}

function checkInput() {
  for (const player of getPlayers()) {
    checkInputAll(player);
    checkInputTrinkets(player);
    checkInputPocket(player);
  }
}

function checkInputAll(player: EntityPlayer) {
  if (
    hotkeys.fastDropAllKeyboard !== -1 &&
    isKeyboardPressed(hotkeys.fastDropAllKeyboard, 0)
  ) {
    fastDrop(player, FastDropTarget.ALL);
  }
}

function checkInputTrinkets(player: EntityPlayer) {
  if (
    hotkeys.fastDropTrinketsKeyboard !== -1 &&
    isKeyboardPressed(hotkeys.fastDropTrinketsKeyboard, 0)
  ) {
    fastDrop(player, FastDropTarget.TRINKETS);
  }
}

function checkInputPocket(player: EntityPlayer) {
  if (
    hotkeys.fastDropPocketKeyboard !== -1 &&
    isKeyboardPressed(hotkeys.fastDropPocketKeyboard, 0)
  ) {
    fastDrop(player, FastDropTarget.POCKET_ITEMS);
  }
}

function fastDrop(player: EntityPlayer, target: FastDropTarget) {
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
  if (target === FastDropTarget.ALL || target === FastDropTarget.POCKET_ITEMS) {
    const pos1 = findFreePosition(player.Position);
    player.DropPocketItem(0, pos1);
    const pos2 = findFreePosition(player.Position);
    player.DropPocketItem(1, pos2);
  }
}

// This logic is copied from InputHelper
function isKeyboardPressed(key: Keyboard, controllerIndex: int) {
  return (
    Input.IsButtonPressed(key, controllerIndex) &&
    !Input.IsButtonPressed(key % 32, controllerIndex)
  );
}
