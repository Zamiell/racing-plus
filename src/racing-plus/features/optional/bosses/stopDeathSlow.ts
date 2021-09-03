import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_DEATH (66)
export function postNPCUpdateDeath(npc: EntityNPC): void {
  if (!config.stopDeathSlow) {
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
