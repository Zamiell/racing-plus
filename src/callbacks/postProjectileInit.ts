import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_PROJECTILE_INIT,
    rock,
    ProjectileVariant.PROJECTILE_ROCK,
  );
}

function rock(projectile: EntityProjectile) {
  clearerShadowAttacks.postProjectileInitRock(projectile);
}
