import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { isSelfDamage } from "../../../../../util";

export default function fastTravelEntityTakeDmgPlayer(
  tookDamage: Entity,
  damageFlags: DamageFlag,
): void {
  if (!config.fastTravel) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (player !== null && !isSelfDamage(damageFlags)) {
    g.run.level.fastTravel.tookDamage = true;
  }
}
