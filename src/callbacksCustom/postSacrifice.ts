import * as preventSacrificeRoomTeleport from "../features/mandatory/preventSacrificeRoomTeleport";
import * as showNumSacrifices from "../features/optional/quality/showNumSacrifices";

export function main(player: EntityPlayer, numSacrifices: int): void {
  // Mandatory
  preventSacrificeRoomTeleport.postSacrifice(numSacrifices);

  // QoL
  showNumSacrifices.postSacrifice(numSacrifices);
}
