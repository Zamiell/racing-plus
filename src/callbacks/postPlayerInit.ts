// Note that checking for "isChildPlayer()" does not work in this callback;
// use the PostPlayerInitLate for that

import * as nLuck from "../features/items/nLuck";
import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";

export function main(player: EntityPlayer): void {
  // log("MC_POST_PLAYER_INIT");

  // Mandatory
  disableMultiplayer.postPlayerInit(player);

  // Items
  nLuck.postPlayerInit(player);
}
