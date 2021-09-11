import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export default function racePreCustomRevive(player: EntityPlayer): int | void {
  if (!config.clientCommunication) {
    return undefined;
  }

  return seededDeath.preCustomRevive(player);
}