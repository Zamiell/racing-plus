// Needles stay underground for too long, causing the player to sit and wait without performing any
// inputs. The state frame starts at -33 and increments upwards to 0. If there is more than one
// Needle in the room, each subsequent Needle will have 39 frames added to.

import { config } from "../../../modConfigMenu";

// Adjust the counter for multiple Needles so that each one jumps individually.
const FRAME_DELAY_BEFORE_JUMPING = -8;

// ModCallback.POST_NPC_UPDATE (0)
// EntityType.NEEDLE (881)
export function postNPCUpdateNeedle(npc: EntityNPC): void {
  if (!config.fastNeedles) {
    return;
  }

  if (npc.StateFrame < FRAME_DELAY_BEFORE_JUMPING) {
    npc.StateFrame = FRAME_DELAY_BEFORE_JUMPING;
  }
}
