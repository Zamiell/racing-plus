import { LaserVariant, ModCallback } from "isaac-typescript-definitions";
import { seededDeathPostLaserInitGiantRed } from "../features/mandatory/seededDeath/callbacks/postLaserInit";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_LASER_INIT,
    giantRed,
    LaserVariant.GIANT_RED, // 6
  );
}

// LaserVariant.GIANT_RED (6)
function giantRed(laser: EntityLaser) {
  seededDeathPostLaserInitGiantRed(laser);
}
