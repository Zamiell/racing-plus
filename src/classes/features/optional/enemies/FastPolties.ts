import { EntityType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastPolties extends ConfigurableModFeature {
  configKey: keyof Config = "FastPolties";

  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, EntityType.POLTY)
  postNPCInitLatePolty(npc: EntityNPC): void {
    npc.StateFrame = 0;
  }
}
