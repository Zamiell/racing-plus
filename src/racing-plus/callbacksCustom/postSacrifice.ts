import * as showNumSacrifices from "../features/optional/quality/showNumSacrifices";
import racePostSacrifice from "../features/race/callbacks/postSacrifice";

export function main(player: EntityPlayer, numSacrifices: int): void {
  racePostSacrifice(player, numSacrifices);

  // Quality of life
  showNumSacrifices.postSacrifice(numSacrifices);
}
