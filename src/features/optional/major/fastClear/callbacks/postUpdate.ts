import {
  getFinalFrameOfAnimation,
  getGridEntities,
  log,
} from "isaacscript-common";
import g from "../../../../../globals";
import { earlyClearRoom } from "../earlyClearRoom";
import { shouldEnableFastClear } from "../shouldEnableFastClear";
import v from "../v";

export function fastClearPostUpdate(): void {
  if (!shouldEnableFastClear()) {
    return;
  }

  checkQueue();
  checkEarlyClearRoom();
}

function checkQueue() {
  const gameFrameCount = g.g.GetFrameCount();

  for (let i = v.room.NPCQueue.length - 1; i >= 0; i--) {
    const fastClearNPCDescription = v.room.NPCQueue[i];
    if (gameFrameCount < fastClearNPCDescription.gameFrameToModify) {
      continue;
    }

    v.room.NPCQueue.splice(i, 1);

    const entity = fastClearNPCDescription.entityPtr.Ref;
    if (entity === undefined) {
      continue;
    }

    const npc = entity.ToNPC();
    if (npc !== undefined) {
      applyFastClear(npc);
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

function checkEarlyClearRoom() {
  if (v.run.earlyClearedRoom) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomFrameCount = g.r.GetFrameCount();

  // If a frame has passed since an enemy died, reset the delay counter
  if (
    v.run.delayClearUntilFrame !== null &&
    gameFrameCount >= v.run.delayClearUntilFrame
  ) {
    v.run.delayClearUntilFrame = null;
  }

  // Check on every frame to see if we need to open the doors
  if (
    v.run.aliveEnemies.size === 0 &&
    v.run.delayClearUntilFrame === null &&
    !roomClear &&
    checkAllPressurePlatesPushed() &&
    // Under certain conditions, the room can be clear of enemies on the first frame
    roomFrameCount > 1
  ) {
    earlyClearRoom();
  }
}

function checkAllPressurePlatesPushed() {
  const hasPressurePlates = g.r.HasTriggerPressurePlates();

  if (!hasPressurePlates || v.room.buttonsAllPushed) {
    return true;
  }

  // We are in a room with pressure plates, so check to see if they have all been pressed
  for (const gridEntity of getGridEntities(
    GridEntityType.GRID_PRESSURE_PLATE,
  )) {
    const gridEntityDesc = gridEntity.GetSaveState();
    if (gridEntityDesc.State !== PressurePlateState.PRESSURE_PLATE_PRESSED) {
      return false;
    }
  }

  v.room.buttonsAllPushed = true;
  return true;
}
