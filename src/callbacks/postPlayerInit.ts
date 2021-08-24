import { speedrunPostPlayerInit } from "../features/speedrun/callbacks/postPlayerInit";

// Note that checking for "isChildPlayer()" does not work in this callback;
// use the PostPlayerInitLate for that
export function main(player: EntityPlayer): void {
  speedrunPostPlayerInit(player);
}
