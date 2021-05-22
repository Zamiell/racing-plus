import g from "../globals";
import { getPlayers } from "../misc";

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
    g.config.fastDropAllKeyboard !== -1 &&
    InputHelper.KeyboardPressed(
      g.config.fastDropAllKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.ALL);
  }

  if (
    g.config.fastDropAllController !== -1 &&
    Input.IsButtonPressed(
      g.config.fastDropAllController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.ALL);
  }
}

function checkInputTrinkets(player: EntityPlayer) {
  if (
    g.config.fastDropTrinketsKeyboard !== -1 &&
    InputHelper.KeyboardPressed(
      g.config.fastDropTrinketsKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.TRINKETS);
  }

  if (
    g.config.fastDropTrinketsController !== -1 &&
    Input.IsButtonPressed(
      g.config.fastDropTrinketsController,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.TRINKETS);
  }
}

function checkInputPocket(player: EntityPlayer) {
  if (
    g.config.fastDropPocketKeyboard !== -1 &&
    InputHelper.KeyboardPressed(
      g.config.fastDropPocketKeyboard,
      player.ControllerIndex,
    )
  ) {
    fastDrop(player, FastDropTarget.POCKET);
  }

  if (
    g.config.fastDropPocketController !== -1 &&
    Input.IsButtonPressed(
      g.config.fastDropPocketController,
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
