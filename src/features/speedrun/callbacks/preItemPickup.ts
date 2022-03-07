import { PickingUpItem } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../types/CollectibleTypeCustom";
import { inSpeedrun } from "../speedrun";
import v from "../v";

/** In render frames. */
const DELAY_FRAMES_BEFORE_STARTING_FADEOUT = 30;

export function speedrunPreItemPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  if (!inSpeedrun()) {
    return;
  }

  checkCheckpointTouched(player, pickingUpItem);
}

function checkCheckpointTouched(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
) {
  if (
    pickingUpItem.itemType !== ItemType.ITEM_PASSIVE ||
    pickingUpItem.subType !== CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT
  ) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();

  // Give them the Checkpoint custom item
  // (this is used by the AutoSplitter to know when to split)
  player.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT, 0, false);

  // Freeze the player
  player.ControlsEnabled = false;

  // Mark to fade out after the "Checkpoint" text has displayed on the screen for a little bit
  v.run.fadeFrame = isaacFrameCount + DELAY_FRAMES_BEFORE_STARTING_FADEOUT;

  // Record how long this run took
  if (v.persistent.startedCharacterFrame !== null) {
    const elapsedFrames = isaacFrameCount - v.persistent.startedCharacterFrame;
    v.persistent.characterRunFrames.push(elapsedFrames);
  }

  // Mark our current frame as the starting time for the next character
  v.persistent.startedCharacterFrame = isaacFrameCount;

  // Show the run summary (including the average time per character for the run so far)
  v.room.showEndOfRunText = true;
}
