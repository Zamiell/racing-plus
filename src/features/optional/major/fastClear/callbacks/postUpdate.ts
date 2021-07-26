import g from "../../../../../globals";
import log from "../../../../../log";
import * as angels from "../angels";
import * as krampus from "../krampus";

export default function fastClearPostUpdate(): void {
  if (!g.config.fastClear) {
    return;
  }

  checkQueue();
  krampus.postUpdate();
  angels.postUpdate();
}

function checkQueue() {
  const gameFrameCount = g.g.GetFrameCount();

  for (let i = g.run.room.fastClearNPCQueue.length - 1; i >= 0; i--) {
    const fastClearNPCDescription = g.run.room.fastClearNPCQueue[i];
    if (gameFrameCount >= fastClearNPCDescription.gameFrameToModify) {
      g.run.room.fastClearNPCQueue.splice(i, 1);
      const entity = fastClearNPCDescription.entityPtr.Ref;
      if (entity !== null) {
        const npc = entity.ToNPC();
        if (npc !== null) {
          applyFastClear(npc);
        }
      }
    }
  }
}

function applyFastClear(npc: EntityNPC) {
  // This is the magic that allows fast-clear to work
  log(`Applying fast-clear to NPC: ${npc.Type}.${npc.Variant}.${npc.SubType}`);
  npc.CanShutDoors = false;

  // Find out how many frames the death animation is
  const sprite = npc.GetSprite();
  const finalFrame = getFinalFrame(sprite);

  // Mark the final frame of the death animation on the entity's data so that we can revert the
  // CanShutDoors attribute later
  const data = npc.GetData();
  data.resetAttributeFrame = finalFrame;

  // Perform some additional steps for specific entities
  if (npc.Type === EntityType.ENTITY_FALLEN && npc.Variant === 1) {
    krampus.postEntityKill(npc);
  } else if (
    (npc.Type === EntityType.ENTITY_URIEL ||
      npc.Type === EntityType.ENTITY_GABRIEL) &&
    npc.Variant === AngelVariant.NORMAL // Fallen Angels do not drop items
  ) {
    angels.postEntityKill(npc);
  }
}

function getFinalFrame(sprite: Sprite) {
  const currentFrame = sprite.GetFrame();
  sprite.SetLastFrame();
  const finalFrame = sprite.GetFrame();
  sprite.SetFrame(currentFrame);
  return finalFrame;
}
