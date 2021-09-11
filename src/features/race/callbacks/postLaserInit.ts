import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export function giantRed(laser: EntityLaser): void {
  if (!config.clientCommunication) {
    return;
  }

  seededDeath.postLaserInitGiantRed(laser);
}
