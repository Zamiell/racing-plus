// Prevent racers from using a Sacrifice Room to skip all of the floors on races to The Lamb &
// Mega Satan

import { config } from "../../../modConfigMenu";
import * as preventSacrificeRoomTeleport from "../preventSacrificeRoomTeleport";

export function racePostSacrifice(
  _player: EntityPlayer,
  numSacrifices: int,
): void {
  if (!config.clientCommunication) {
    return;
  }

  preventSacrificeRoomTeleport.postSacrifice(numSacrifices);
}
