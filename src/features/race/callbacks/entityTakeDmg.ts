import { config } from "../../../modConfigMenu";
import * as seededDeath from "../seededDeath";

export function entityTakeDmgPlayer(
  _tookDamage: Entity,
  _damageAmount: int,
): boolean | void {
  if (!config.clientCommunication) {
    return undefined;
  }

  return seededDeath.entityTakeDmgPlayer();
}
