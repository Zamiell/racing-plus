import {
  EntityType,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastGhosts extends ConfigurableModFeature {
  configKey: keyof Config = "FastGhosts";

  // 0, 219
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.WIZOOB)
  postNPCUpdateWizoob(npc: EntityNPC): void {
    this.checkSpeedUpGhost(npc);
  }

  // 0, 285
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.RED_GHOST)
  postNPCUpdateRedGhost(npc: EntityNPC): void {
    this.checkSpeedUpGhost(npc);
  }

  checkSpeedUpGhost(npc: EntityNPC): void {
    // Speed up the attack pattern of Wizoobs & Red Ghosts.
    if (npc.State === NPCState.IDLE) {
      // This is when they are disappeared and doing nothing.
      npc.StateFrame = 0; // `StateFrame` decrements down from 60 to 0, so just jump ahead.
    }
  }
}
