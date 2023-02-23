import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import { fastClearPostProjectileInitMeat } from "../features/optional/major/fastClear/callbacks/postProjectileInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_PROJECTILE_INIT,
    meat,
    ProjectileVariant.MEAT, // 11
  );
}

// ProjectileVariant.MEAT (11)
function meat(projectile: EntityProjectile) {
  fastClearPostProjectileInitMeat(projectile);
}
