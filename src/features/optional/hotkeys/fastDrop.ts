import { PocketItemSlot } from "isaac-typescript-definitions";
import {
  findFreePosition,
  getEnumValues,
  getPlayers,
  isKeyboardPressed,
  MAX_PLAYER_TRINKET_SLOTS,
  repeat,
} from "isaacscript-common";
import { hotkeys } from "../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../utilsGlobals";

enum FastDropTarget {
  ALL,
  TRINKETS,
  POCKET_ITEMS,
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

  // Normally, we would iterate over the players and check for inputs corresponding to their
  // `ControllerIndex`. However, some Xbox controller inputs are not read by the game, which forces
  // players to use Joy2Key to bind them to keyboard buttons. Thus, a player might have a
  // `ControllerIndex` of 1 and be pressing inputs on `ControllerIndex` 0. Because of this, we only
  // check for keyboard inputs, and then iterate over the players if an input is pressed.
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
    // Fast-drop is disabled during when the player is holding an item above their head.
    if (!player.IsItemQueueEmpty()) {
      return;
    }

    // Trinkets
    if (target === FastDropTarget.ALL || target === FastDropTarget.TRINKETS) {
      repeat(MAX_PLAYER_TRINKET_SLOTS, () => {
        const pos = findFreePosition(player.Position);
        player.DropTrinket(pos, false); // We specify that The Tick should not be dropped
      });
    }

    // Pocket items (cards, pills, runes, etc.)
    if (
      target === FastDropTarget.ALL ||
      target === FastDropTarget.POCKET_ITEMS
    ) {
      for (const pocketItemSlot of getEnumValues(PocketItemSlot)) {
        const pos = findFreePosition(player.Position);
        player.DropPocketItem(pocketItemSlot, pos);
      }
    }
  }
}
