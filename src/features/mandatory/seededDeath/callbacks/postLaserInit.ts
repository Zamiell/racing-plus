import { shouldSeededDeathApply } from "../seededDeath";
import v from "../v";

// ModCallbacks.MC_POST_LASER_INIT (47)
// LaserVariant.GIANT_RED (6)
export function seededDeathPostLaserInitGiantRed(laser: EntityLaser): void {
  if (!shouldSeededDeathApply()) {
    return;
  }

  if (v.run.debuffEndFrame === null) {
    return;
  }

  // There is no way to stop a Mega Blast while it is currently going with the current API
  // As a workaround, remove all "giant" lasers on initialization
  laser.Remove();

  // Even though we delete it, it will still show up for a frame
  // Thus, the Mega Blast laser will look like it is intermittently shooting,
  // even though it deals no damage
  // Make it invisible to fix this
  laser.Visible = false;
  // (this also has the side effect of muting the sound effects)
}
