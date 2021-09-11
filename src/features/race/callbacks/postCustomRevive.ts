import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export default function racePostCustomRevive(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seededDeath.postCustomRevive(player);
}