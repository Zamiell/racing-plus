import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export function racePostFlip(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seededDeath.postFlip(player);
}
