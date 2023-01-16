import { shouldSeededDeathFeatureApply } from "../seededDeath";
import { v } from "../v";

// LaserVariant.GIANT_RED (6)
export function seededDeathPostLaserInitGiantRed(laser: EntityLaser): void {
  if (!shouldSeededDeathFeatureApply()) {
    return;
  }

  if (v.run.debuffEndFrame === null) {
    return;
  }

  // There is no way to stop a Mega Blast while it is currently going. As a workaround, remove all
  // `LaserVariant.GIANT_RED` lasers on initialization.
  laser.Remove();

  // Even though we delete it, it will still show up for a frame. Thus, the Mega Blast laser will
  // look like it is intermittently shooting, even though it deals no damage. Make it invisible to
  // fix this. (This also has the side effect of muting the sound effects.)
  laser.Visible = false;
}
