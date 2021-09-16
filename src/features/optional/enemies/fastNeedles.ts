// The state frame starts at -33 and increments upwards to 0
// If there is more than one Needle in the room, each subsequent Needle will have 39 frames added to

import { config } from "../../../modConfigMenu";

// its counter so that each one jumps individually
const FRAME_DELAY_BEFORE_JUMPING = -7;

// ModCallbacks.MC_NPC_UPDATE (0)
// EntityType.ENTITY_NEEDLE (881)
export function postNPCUpdateNeedle(npc: EntityNPC): void {
  if (!config.fastNeedles) {
    return;
  }

  if (npc.StateFrame < FRAME_DELAY_BEFORE_JUMPING) {
    npc.StateFrame = FRAME_DELAY_BEFORE_JUMPING;
  }
}
