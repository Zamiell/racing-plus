import {
  EntityType,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** The appear animation and death animation of Blastocyst is sped up. */
export class FastBlastocyst extends ConfigurableModFeature {
  configKey: keyof Config = "FastBlastocyst";

  // 28, 74
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.BLASTOCYST_BIG)
  postNPCRenderBlastocystBig(npc: EntityNPC): void {
    speedUpAnimations(npc);
  }

  // 28, 75
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.BLASTOCYST_MEDIUM)
  postNPCRenderBlastocystMedium(npc: EntityNPC): void {
    speedUpAnimations(npc);
  }

  // 28, 76
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.BLASTOCYST_SMALL)
  postNPCRenderBlastocystSmall(npc: EntityNPC): void {
    speedUpAnimations(npc);
  }
}

function speedUpAnimations(npc: EntityNPC) {
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation === "Split") {
    sprite.PlaybackSpeed = 3;
  }

  if (npc.State === NPCState.APPEAR_CUSTOM) {
    sprite.SetLastFrame();
  }
}
