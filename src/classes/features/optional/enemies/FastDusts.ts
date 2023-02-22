import {
  EntityType,
  ModCallback,
  NpcState,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastDusts extends ConfigurableModFeature {
  configKey: keyof Config = "FastDusts";

  // 0, 882
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.DUST)
  postNPCUpdateDust(npc: EntityNPC): void {
    if (npc.State === NpcState.SPECIAL) {
      npc.State = NpcState.IDLE;
    }
  }
}
