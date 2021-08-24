import { speedrunPostPlayerInitLate } from "../features/speedrun/callbacks/postPlayerInitLate";

export function main(player: EntityPlayer): void {
  speedrunPostPlayerInitLate(player);
}
