import { DamageFlag } from "isaac-typescript-definitions";
import { isSelfDamage } from "isaacscript-common";
import { v } from "../../../../../classes/features/optional/major/fastTravel/v";
import { config } from "../../../../../modConfigMenu";

export function fastTravelEntityTakeDmgPlayer(
  damageFlags: BitFlags<DamageFlag>,
): void {
  if (!config.FastTravel) {
    return;
  }

  if (!isSelfDamage(damageFlags)) {
    v.level.tookDamage = true;
    v.run.perfection.floorsWithoutDamage = 0;
  }
}
