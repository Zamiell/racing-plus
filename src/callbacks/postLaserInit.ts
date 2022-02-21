import { seededDeathPostLaserInitGiantRed } from "../features/mandatory/seededDeath/callbacks/postLaserInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_LASER_INIT,
    giantRed,
    LaserVariant.GIANT_RED, // 6
  );
}

// LaserVariant.GIANT_RED (6)
function giantRed(laser: EntityLaser) {
  seededDeathPostLaserInitGiantRed(laser);
}
