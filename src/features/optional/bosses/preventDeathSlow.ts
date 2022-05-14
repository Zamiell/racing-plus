import { DeathState } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.DEATH (66)
export function postNPCUpdateDeath(npc: EntityNPC): void {
  if (!config.preventDeathSlow) {
    return;
  }

  // We only care about the main Death
  if (npc.Variant !== 0) {
    return;
  }

  // Stop Death from performing the attack that slows down the player
  if (npc.State === DeathState.SLOW_ATTACK) {
    npc.State = DeathState.MAIN_IDLE;
  }
}
