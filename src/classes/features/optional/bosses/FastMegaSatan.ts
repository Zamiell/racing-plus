import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, ReadonlySet } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const MEGA_SATAN_REMOVE_ANIMATIONS = new ReadonlySet<string>([
  "Appear",
  "Hide",
  "Reveal",
]);

export class FastMegaSatan extends ConfigurableModFeature {
  configKey: keyof Config = "fastMegaSatan";

  // 28, 274
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.MEGA_SATAN)
  postNPCRenderMegaSatan(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();

    if (MEGA_SATAN_REMOVE_ANIMATIONS.has(animation)) {
      sprite.SetLastFrame();
    } else if (animation === "Death") {
      sprite.PlaybackSpeed = 10;
    }
  }

  // 28, 275
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.MEGA_SATAN_2)
  postNPCRenderMegaSatan2(npc: EntityNPC): void {
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();

    if (animation === "Appear") {
      sprite.PlaybackSpeed = 10;
    }
  }
}
