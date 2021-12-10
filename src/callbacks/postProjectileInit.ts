import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import { fastClearPostProjectileInit } from "../features/optional/major/fastClear/callbacks/postProjectileInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_PROJECTILE_INIT,
    rock,
    ProjectileVariant.PROJECTILE_ROCK,
  );
}

function rock(projectile: EntityProjectile) {
  fastClearPostProjectileInit(projectile);
  clearerShadowAttacks.postProjectileInitRock(projectile);
}
