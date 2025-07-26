import {
  EntityType,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback, getNPCs } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const SHADOW_APPEAR_FRAME = 40;
const START_FRAME = SHADOW_APPEAR_FRAME - 15;
const HAND_GROUND_IMPACT_FRAME = 89;
const DELAY_FRAMES = 4;

export class FastHands extends ConfigurableModFeature {
  configKey: keyof Config = "FastHands";

  // 0, 213
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.MOMS_HAND)
  postNPCUpdateMomsHand(npc: EntityNPC): void {
    this.checkSpeedUpHand(npc);
  }

  // 0, 287
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.MOMS_DEAD_HAND)
  postNPCUpdateMomsDeadHand(npc: EntityNPC): void {
    this.checkSpeedUpHand(npc);
  }

  checkSpeedUpHand(npc: EntityNPC): void {
    // `NPCState.MOVE` is when they are following the player.
    if (npc.State === NPCState.MOVE) {
      this.speedUpInitialDelay(npc);
      this.checkOtherHandOverlap(npc);
    }
  }

  speedUpInitialDelay(npc: EntityNPC): void {
    // `StateFrame` starts between 0 and a random negative value and ticks upwards.
    if (npc.StateFrame < START_FRAME) {
      npc.StateFrame = START_FRAME;
    }

    // Prevent the bug where confused hands will take longer to fall.
    if (npc.StateFrame < HAND_GROUND_IMPACT_FRAME) {
      npc.RemoveStatusEffects();
    }
  }

  checkOtherHandOverlap(npc: EntityNPC): void {
    // Check to see if there are any other hands in the room with this state frame. If so, we have
    // to do a small adjustment because if multiple hands fall at the exact same time, they will
    // stack on top of each other and appear as a single hand.
    if (
      npc.StateFrame === SHADOW_APPEAR_FRAME
      && this.isOtherHandOverlapping(npc)
    ) {
      npc.StateFrame += DELAY_FRAMES;
    }
  }

  isOtherHandOverlapping(initialHand: EntityNPC): boolean {
    const momsHands = getNPCs(EntityType.MOMS_HAND);
    const momsDeadHands = getNPCs(EntityType.MOMS_DEAD_HAND);
    const hands = [...momsHands, ...momsDeadHands];

    return hands.some(
      (hand) =>
        GetPtrHash(hand) !== GetPtrHash(initialHand)
        && hand.State === NPCState.MOVE
        && hand.StateFrame === initialHand.StateFrame,
    );
  }
}
