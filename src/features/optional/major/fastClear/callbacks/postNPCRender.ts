import { shouldEnableFastClear } from "../shouldEnableFastClear";

export function fastClearPostNPCRender(npc: EntityNPC): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkResetAttributeFrame(npc);
}

// Remove the fast-clear attribute from the NPC on the final frame of its death animation
function checkResetAttributeFrame(npc: EntityNPC) {
  const data = npc.GetData();
  if (data.resetAttributeFrame === undefined) {
    return;
  }

  const sprite = npc.GetSprite();
  const animation = sprite.GetAnimation();
  const animationFrame = sprite.GetFrame();
  if (animation === "Death" && animationFrame === data.resetAttributeFrame) {
    npc.CanShutDoors = true;
    data.resetAttributeFrame = undefined;
  }
}
