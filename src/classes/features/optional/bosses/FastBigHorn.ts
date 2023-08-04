import {
  BigHornState,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, asNPCState } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** Speed up coming out of the ground. */
export class FastBigHorn extends ConfigurableModFeature {
  configKey: keyof Config = "FastBigHorn";

  // 0, 411
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.BIG_HORN)
  postNPCUpdateBigHorn(npc: EntityNPC): void {
    if (
      npc.State !==
      asNPCState(BigHornState.HEAD_GOING_UP_OR_GOING_DOWN_INTO_HOLE)
    ) {
      return;
    }

    if (npc.StateFrame >= 67 && npc.StateFrame < 100) {
      npc.StateFrame = 100;
    }
  }
}
