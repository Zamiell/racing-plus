import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export function racePostPlayerFatalDamage(
  player: EntityPlayer,
): boolean | void {
  if (!config.clientCommunication) {
    return undefined;
  }

  return seededDeath.postPlayerFatalDamage(player);
}
