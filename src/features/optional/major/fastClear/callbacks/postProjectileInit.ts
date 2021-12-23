import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingAdd from "../trackingAdd";

export function fastClearPostProjectileInitMeat(
  projectile: EntityProjectile,
): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingAdd.postProjectileInitMeat(projectile);
}
