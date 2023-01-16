import { EntityFlag } from "isaac-typescript-definitions";
import { setEntityOpacity } from "isaacscript-common";

/** The floating heart animation must be separately faded in "statuseffects.anm2". */
const FADE_AMOUNT = 0.25;

/** We reapply the fade on every frame because enemies can be unfaded occasionally. */
// ModCallback.POST_NPC_UPDATE (0)
export function postNPCUpdate(npc: EntityNPC): void {
  if (npc.HasEntityFlags(EntityFlag.FRIENDLY)) {
    setEntityOpacity(npc, FADE_AMOUNT);
  }
}

/** This does not work properly if done in the `POST_PROJECTILE_INIT` callback. */
// ModCallback.POST_PROJECTILE_UPDATE (44)
export function postProjectileUpdate(projectile: EntityProjectile): void {
  if (
    projectile.Parent !== undefined &&
    projectile.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
  ) {
    setEntityOpacity(projectile, FADE_AMOUNT);
  }
}

/**
 * We need to also fade the Brimstone lasers from friendly Vis.
 *
 * This does not work properly if done in the `POST_LASER_INIT` callback.
 *
 * The laser will look bugged, since it will first appear at full opacity, but there is not an
 * elegant workaround for this, so keep it the way it is for now.
 */
// ModCallback.POST_LASER_UPDATE (48)
export function postLaserUpdate(laser: EntityLaser): void {
  if (
    laser.Parent !== undefined &&
    laser.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
  ) {
    setEntityOpacity(laser, FADE_AMOUNT);
  }
}
