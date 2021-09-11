import * as disableMultiplayer from "../features/mandatory/disableMultiplayer";

export function main(player: EntityPlayer): void {
  disableMultiplayer.postPlayerInitLate(player);
}
