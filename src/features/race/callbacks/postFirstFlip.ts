import { config } from "../../../modConfigMenu";
import { formatSetup } from "../formatSetup";

export function racePostFirstFlip(player: EntityPlayer): void {
  if (!config.clientCommunication) {
    return;
  }

  formatSetup(player);
}
