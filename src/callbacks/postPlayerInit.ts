// Note that checking for "isChildPlayer()" does not work in this callback;
// use the PostPlayerInitLate for that

import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";

export function main(player: EntityPlayer): void {
  disableMultiplayer.postPlayerInit(player);
}
