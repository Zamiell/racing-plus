import { shouldEnableFastClear } from "../shouldEnableFastClear";
import * as trackingAdd from "../trackingAdd";

export function fastClearPostProjectileInit(
  projectile: EntityProjectile,
): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  trackingAdd.postProjectileInit(projectile);
}
