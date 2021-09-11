import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export default function racePostPlayerRender(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  seededDeath.postPlayerRender(player);
}
