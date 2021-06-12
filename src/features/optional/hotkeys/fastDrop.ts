import g from "../../../globals";
import { getPlayers } from "../../../misc";

export enum FastDropTarget {
  All,
  Trinkets,
  Pocket,
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
    isKeyboardPressed(g.hotkeys.fastDropAllKeyboard, player.ControllerIndex)
  ) {
    fastDrop(player, FastDropTarget.All);
  }

  if (
    g.hotkeys.fastDropAllController !== -1 &&
    Input.IsButtonPressed(
      g.hotkeys.fastDropAllController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.All);
  }
}

function checkInputTrinkets(player: EntityPlayer) {
  if (
    g.hotkeys.fastDropTrinketsKeyboard !== -1 &&
    isKeyboardPressed(
      g.hotkeys.fastDropTrinketsKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.Trinkets);
  }

  if (
    g.hotkeys.fastDropTrinketsController !== -1 &&
    Input.IsButtonPressed(
      g.hotkeys.fastDropTrinketsController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.Trinkets);
  }
}

function checkInputPocket(player: EntityPlayer) {
  if (
    g.hotkeys.fastDropPocketKeyboard !== -1 &&
    isKeyboardPressed(g.hotkeys.fastDropPocketKeyboard, player.ControllerIndex)
  ) {
    fastDrop(player, FastDropTarget.Pocket);
  }

  if (
    g.hotkeys.fastDropPocketController !== -1 &&
    Input.IsButtonPressed(
      g.hotkeys.fastDropPocketController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.Pocket);
  }
}

function fastDrop(player: EntityPlayer, target: FastDropTarget) {
  // Fast-drop is disabled during when the player is holding an item above their head
  if (!player.IsItemQueueEmpty()) {
    return;
  }

  // Trinkets
  // (the Tick is handled properly because "DropTrinket()" won't do anything in that case)
  if (target === FastDropTarget.All || target === FastDropTarget.Trinkets) {
    const pos1 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropTrinket(pos1, false);
    const pos2 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropTrinket(pos2, false);
  }

  // Pocket items (cards, pills, runes, etc.)
  if (target === FastDropTarget.All || target === FastDropTarget.Pocket) {
    const pos1 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
    player.DropPocketItem(0, pos1);
    const pos2 = g.r.FindFreePickupSpawnPosition(player.Position, 0, true);
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
