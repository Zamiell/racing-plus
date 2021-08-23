import { speedrunPostPlayerInit } from "../features/speedrun/callbacks/postPlayerInit";

export function main(player: EntityPlayer): void {
  speedrunPostPlayerInit(player);
}
