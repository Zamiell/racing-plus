import * as fadeVasculitisTears from "../features/optional/quality/fadeVasculitisTears";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_TEAR_UPDATE,
    blood,
    TearVariant.BLOOD, // 1
  );
}

export function blood(tear: EntityTear): void {
  fadeVasculitisTears.postTearUpdateBloodParticle(tear);
}
