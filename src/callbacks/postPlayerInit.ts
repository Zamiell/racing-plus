// PostPlayerInit will fire at the beginning of a run and upon continuing a saved run

// Note that checking for "isChildPlayer()" does not work in this callback;
// use the PostPlayerInitLate for that

import { getPlayerIndex, log } from "isaacscript-common";
import * as nLuck from "../features/items/nLuck";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const ptrHash = GetPtrHash(player);
  const playerIndex = getPlayerIndex(player);
  log(
    `MC_POST_PLAYER_INIT - character: ${character}, InitSeed: ${player.InitSeed}, PtrHash: ${ptrHash}, playerIndex: ${playerIndex}`,
  );

  // Mandatory
  disableMultiplayer.postPlayerInit(player);

  // Items
  nLuck.postPlayerInit(player);
}
