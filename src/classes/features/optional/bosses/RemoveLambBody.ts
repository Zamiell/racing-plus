import { EntityType, LambVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * Remove The Lamb body once it is defeated so that it does not interfere with taking the trophy.
 */
export class RemoveLambBody extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveLambBody";

  // 0, 273
  @CallbackCustom(
    ModCallbackCustom.POST_NPC_UPDATE_FILTER,
    EntityType.LAMB,
    LambVariant.BODY,
  )
  postNPCUpdateLambBody(npc: EntityNPC): void {
    if (
      npc.IsInvincible() // It turns invincible once it is defeated.
      && !npc.IsDead() // The callback will be fired again during the removal.
    ) {
      npc.Remove();
    }
  }
}
