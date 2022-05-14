import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import { fastClearPostProjectileInitMeat } from "../features/optional/major/fastClear/callbacks/postProjectileInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_PROJECTILE_INIT,
    rock,
    ProjectileVariant.PROJECTILE_ROCK, // 9
  );

  mod.AddCallback(
    ModCallback.POST_PROJECTILE_INIT,
    meat,
    ProjectileVariant.PROJECTILE_MEAT, // 11
  );
}

// ProjectileVariant.PROJECTILE_ROCK (9)
function rock(projectile: EntityProjectile) {
  clearerShadowAttacks.postProjectileInitRock(projectile);
}

// ProjectileVariant.PROJECTILE_MEAT (11)
function meat(projectile: EntityProjectile) {
  fastClearPostProjectileInitMeat(projectile);
}
