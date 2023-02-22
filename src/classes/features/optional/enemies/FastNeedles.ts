import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** Adjust the counter for multiple Needles so that each one jumps individually. */
const FRAME_DELAY_BEFORE_JUMPING = -8;

/**
 * Needles stay underground for too long, causing the player to sit and wait without performing any
 * inputs. The state frame starts at -33 and increments upwards to 0. If there is more than one
 * Needle in the room, each subsequent Needle will have 39 frames added to.
 */
export class FastNeedles extends ConfigurableModFeature {
  configKey: keyof Config = "FastNeedles";

  // 0, 881
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.NEEDLE)
  postNPCUpdateNeedle(npc: EntityNPC): void {
    if (npc.StateFrame < FRAME_DELAY_BEFORE_JUMPING) {
      npc.StateFrame = FRAME_DELAY_BEFORE_JUMPING;
    }
  }
}
