import { log } from "isaacscript-common";
import g from "../../../../../globals";
import { getFinalFrameOfAnimation } from "../../../../../util";
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
  // By setting CanShutDoors to false, we can make the doors open early
  log(`Applying fast-clear to NPC: ${npc.Type}.${npc.Variant}.${npc.SubType}`);
  npc.CanShutDoors = false;

  // At this point, we may or may not be currently playing the death animation
  // Manually set the death animation now the purposes of finding out how long it is
  const sprite = npc.GetSprite();
  sprite.Play("Death", true);
  const finalFrame = getFinalFrameOfAnimation(sprite);

  // Mark the final frame of the death animation on the entity's data so that we can revert the
  // CanShutDoors attribute later
  const data = npc.GetData();
  data.resetAttributeFrame = finalFrame;
}
