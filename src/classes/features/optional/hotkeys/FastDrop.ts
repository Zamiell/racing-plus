import { PocketItemSlot } from "isaac-typescript-definitions";
import {
  findFreePosition,
  getEnumValues,
  getPlayers,
  MAX_PLAYER_TRINKET_SLOTS,
  repeat,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { shouldCheckForGameplayInputs } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

enum FastDropTarget {
  ALL,
  TRINKETS,
  POCKET_ITEMS,
}

export class FastDrop extends MandatoryModFeature {
  /**
   * Normally, we would iterate over the players and check for inputs corresponding to their
   * `ControllerIndex`. However, some Xbox controller inputs are not read by the game, which forces
   * players to use Joy2Key to bind them to keyboard buttons. Thus, a player might have a
   * `ControllerIndex` of 1 and be pressing inputs on `ControllerIndex` 0. Because of this, we only
   * check for keyboard inputs, and then iterate over the players if an input is pressed.
   */
  constructor() {
    super();

    mod.setConditionalHotkey(keyboardFuncFastDropAll, () => {
      fastDropHotkeyPressed(FastDropTarget.ALL);
    });

    mod.setConditionalHotkey(keyboardFuncFastDropTrinkets, () => {
      fastDropHotkeyPressed(FastDropTarget.TRINKETS);
    });

    mod.setConditionalHotkey(keyboardFuncFastDropPocket, () => {
      fastDropHotkeyPressed(FastDropTarget.POCKET_ITEMS);
    });
  }
}

function keyboardFuncFastDropAll() {
  return hotkeys.fastDropAll === -1 ? undefined : hotkeys.fastDropAll;
}

function keyboardFuncFastDropTrinkets() {
  return hotkeys.fastDropTrinkets === -1 ? undefined : hotkeys.fastDropTrinkets;
}

function keyboardFuncFastDropPocket() {
  return hotkeys.fastDropPocket === -1 ? undefined : hotkeys.fastDropPocket;
}

function fastDropHotkeyPressed(target: FastDropTarget) {
  if (!shouldCheckForGameplayInputs()) {
    return;
  }

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
