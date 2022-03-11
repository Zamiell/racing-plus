// Note that checking for "isChildPlayer()" does not work in this callback;
// use the PostPlayerInitLate for that

import * as nLuck from "../features/items/nLuck";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_POST_PLAYER_INIT, main);
}

function main(player: EntityPlayer) {
  /*
  const character = player.GetPlayerType();
  log(
    `MC_POST_PLAYER_INIT - character: ${character}, InitSeed: ${player.InitSeed}`,
  );
  */

  // Mandatory
  disableMultiplayer.postPlayerInit(player);

  // Items
  nLuck.postPlayerInit(player);
}
