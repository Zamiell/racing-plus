import { ModCallback, ProjectileVariant } from "isaac-typescript-definitions";
import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import { fastClearPostProjectileInitMeat } from "../features/optional/major/fastClear/callbacks/postProjectileInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.POST_PROJECTILE_INIT,
    rock,
    ProjectileVariant.ROCK, // 9
  );

  mod.AddCallback(
    ModCallback.POST_PROJECTILE_INIT,
    meat,
    ProjectileVariant.MEAT, // 11
  );
}

// ProjectileVariant.ROCK (9)
function rock(projectile: EntityProjectile) {
  clearerShadowAttacks.postProjectileInitRock(projectile);
}

// ProjectileVariant.MEAT (11)
function meat(projectile: EntityProjectile) {
  fastClearPostProjectileInitMeat(projectile);
}
