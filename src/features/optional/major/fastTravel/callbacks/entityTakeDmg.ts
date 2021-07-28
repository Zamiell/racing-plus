import g from "../../../../../globals";
import { isSelfDamage } from "../../../../../util";

export function entityTakeDmgPlayer(
  tookDamage: Entity,
  damageFlags: DamageFlag,
): void {
  if (!g.config.fastTravel) {
    return;
  }

  const player = tookDamage.ToPlayer();
  if (player !== null && !isSelfDamage(damageFlags)) {
    g.run.level.fastTravel.tookDamage = true;
  }
}
