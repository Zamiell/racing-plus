import { shouldSeededDeathFeatureApply } from "../seededDeath";
import { v } from "../v";

// EffectVariant.BLOOD_DROP (70)
export function seededDeathPostEffectInitBloodDrop(effect: EntityEffect): void {
  if (!shouldSeededDeathFeatureApply()) {
    return;
  }

  if (v.run.debuffEndFrame === null) {
    return;
  }

  // Since there is no way to stop the Mega Blast from firing, we remove the laser in the
  // PostLaserInit callback. However, blood drops will also spawn when the laser hits a wall.
  effect.Remove();
}
