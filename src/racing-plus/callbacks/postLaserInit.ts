import * as racePostLaserInit from "../features/race/callbacks/postLaserInit";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_LASER_INIT,
    giantRed,
    LaserVariant.GIANT_RED, // 6
  );
}

// LaserVariant.GIANT_RED (6)
function giantRed(laser: EntityLaser): void {
  racePostLaserInit.giantRed(laser);
}
