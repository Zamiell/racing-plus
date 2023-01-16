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

// ModCallback.POST_PROJECTILE_UPDATE (44)
export function postProjectileUpdate(projectile: EntityProjectile): void {
  if (
    projectile.Parent !== undefined &&
    projectile.Parent.HasEntityFlags(EntityFlag.FRIENDLY)
  ) {
    setEntityOpacity(projectile, FADE_AMOUNT);
  }
}
