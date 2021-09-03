import { config } from "../../../../../modConfigMenu";
import { isSelfDamage } from "../../../../../util";
import v from "../v";

export default function fastTravelEntityTakeDmgPlayer(
  tookDamage: Entity,
  damageFlags: DamageFlag,
): void {
  if (!config.fastTravel) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (player !== null && !isSelfDamage(damageFlags)) {
    v.level.tookDamage = true;
    v.run.perfection.floorsWithoutDamage = 0;
  }
}
