import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export function bloodDrop(effect: EntityEffect): void {
  if (!config.clientCommunication) {
    return;
  }

  seededDeath.postEffectInitBloodDrop(effect);
}
