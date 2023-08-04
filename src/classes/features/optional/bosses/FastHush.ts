import {
  EntityCollisionClass,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastHush extends ConfigurableModFeature {
  configKey: keyof Config = "FastHush";

  // 28, 407
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.HUSH)
  postNPCRenderHush(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();

    if (animation === "Appear") {
      sprite.SetLastFrame();
    }
  }

  /**
   * Skipping the appear animation has the side effect of keeping the `EntityCollisionClass` set to
   * `ENEMIES` (instead of `ALL`). Thus, we manually set the `EntityCollisionClass`. (This cannot be
   * done in the `POST_NPC_INIT` callback.)
   */
  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, EntityType.HUSH)
  postNPCInitLateHush(npc: EntityNPC): void {
    npc.EntityCollisionClass = EntityCollisionClass.ALL;
  }
}
