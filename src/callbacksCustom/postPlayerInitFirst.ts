// PostPlayerInit will fire at the beginning of a run and upon continuing a saved run.

// Note that checking for `isChildPlayer` does not work in this callback; use the
// `POST_PLAYER_INIT_LATE` callback for that.

import { getPlayerIndex, log, ModCallbackCustom } from "isaacscript-common";
import * as nLuck from "../features/items/nLuck";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_FIRST, main);
}

function main(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const ptrHash = GetPtrHash(player);
  const playerIndex = getPlayerIndex(player);
  log(
    `MC_POST_PLAYER_INIT_FIRST - character: ${character}, InitSeed: ${player.InitSeed}, ControllerIndex: ${player.ControllerIndex}, PtrHash: ${ptrHash}, playerIndex: ${playerIndex}`,
  );

  // Items
  nLuck.postPlayerInitFirst(player);
}
