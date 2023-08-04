import {
  EntityType,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastDusts extends ConfigurableModFeature {
  configKey: keyof Config = "FastDusts";

  // 0, 882
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.DUST)
  postNPCUpdateDust(npc: EntityNPC): void {
    if (npc.State === NPCState.SPECIAL) {
      npc.State = NPCState.IDLE;
    }
  }
}
