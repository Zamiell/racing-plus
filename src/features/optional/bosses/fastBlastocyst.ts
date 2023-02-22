import { config } from "../../../modConfigMenu";

// ModCallback.POST_NPC_RENDER (28)
// EntityType.BLASTOCYST_BIG (74)
export function postNPCRenderBlastocystBig(npc: EntityNPC): void {
  if (!config.FastBlastocyst) {
    return;
  }

  speedUpSplitAnimation(npc);
}

// ModCallback.POST_NPC_RENDER (28)
// EntityType.BLASTOCYST_MEDIUM (75)
export function postNPCRenderBlastocystMedium(npc: EntityNPC): void {
  if (!config.FastBlastocyst) {
    return;
  }

  speedUpSplitAnimation(npc);
}

// ModCallback.POST_NPC_RENDER (28)
// EntityType.BLASTOCYST_SMALL (76)
export function postNPCRenderBlastocystSmall(npc: EntityNPC): void {
  if (!config.FastBlastocyst) {
    return;
  }

  speedUpSplitAnimation(npc);
}

function speedUpSplitAnimation(npc: EntityNPC) {
  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation === "Split") {
    sprite.PlaybackSpeed = 3;
  }
}
