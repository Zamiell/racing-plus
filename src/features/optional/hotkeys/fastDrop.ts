import g from "../../../globals";
import { getPlayers } from "../../../misc";

export enum FastDropTarget {
  ALL,
  TRINKETS,
  POCKET,
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
    g.hotkeys.fastDropAllKeyboard !== -1 &&
    InputHelper.KeyboardPressed(
      g.hotkeys.fastDropAllKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.ALL);
  }

  if (
    g.hotkeys.fastDropAllController !== -1 &&
    Input.IsButtonPressed(
      g.hotkeys.fastDropAllController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.ALL);
  }
}

function checkInputTrinkets(player: EntityPlayer) {
  if (
    g.hotkeys.fastDropTrinketsKeyboard !== -1 &&
    InputHelper.KeyboardPressed(
      g.hotkeys.fastDropTrinketsKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.TRINKETS);
  }

  if (
    g.hotkeys.fastDropTrinketsController !== -1 &&
    Input.IsButtonPressed(
      g.hotkeys.fastDropTrinketsController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.TRINKETS);
  }
}

function checkInputPocket(player: EntityPlayer) {
  if (
    g.hotkeys.fastDropPocketKeyboard !== -1 &&
    InputHelper.KeyboardPressed(
      g.hotkeys.fastDropPocketKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.POCKET);
  }

  if (
    g.hotkeys.fastDropPocketController !== -1 &&
    Input.IsButtonPressed(
      g.hotkeys.fastDropPocketController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.POCKET);
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
    const pos3 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropTrinket(pos3, false);
    const pos4 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropTrinket(pos4, false);
  }

  // Pocket items (cards, pills, runes, etc.)
  if (target === FastDropTarget.ALL || target === FastDropTarget.POCKET) {
    const pos1 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropPocketItem(0, pos1);
    const pos2 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropPocketItem(1, pos2);
  }
}
