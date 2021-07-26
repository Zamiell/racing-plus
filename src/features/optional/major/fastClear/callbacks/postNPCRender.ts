import g from "../../../../../globals";

export default function fastClearPostNPCRender(npc: EntityNPC): void {
  if (!g.config.fastClear) {
    return;
  }

  checkFinalFrameOfDeathAnimation(npc);
}

function checkFinalFrameOfDeathAnimation(npc: EntityNPC) {
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
