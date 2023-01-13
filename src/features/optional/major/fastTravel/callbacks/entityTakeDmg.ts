import { DamageFlag } from "isaac-typescript-definitions";
import { isSelfDamage } from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { v } from "../v";

export function fastTravelEntityTakeDmgPlayer(
  damageFlags: BitFlags<DamageFlag>,
): void {
  if (!config.fastTravel) {
    return;
  }

  if (!isSelfDamage(damageFlags)) {
    v.level.tookDamage = true;
    v.run.perfection.floorsWithoutDamage = 0;
  }
}
