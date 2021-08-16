import { PickingUpItem } from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../types/enums";
import v from "../v";

export function speedrunPreItemPickup(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  checkCheckpointTouched(player, pickingUpItem);
}

function checkCheckpointTouched(
  player: EntityPlayer,
  pickingUpItem: PickingUpItem,
) {
  if (
    pickingUpItem.type !== ItemType.ITEM_PASSIVE ||
    pickingUpItem.id !== CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT
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
  v.run.fadeFrame = isaacFrameCount + 30;

  // Record how long this run took
  if (v.persistent.startedCharTime !== null) {
    const elapsedMilliseconds = Isaac.GetTime() - v.persistent.startedCharTime;
    v.persistent.characterRunTimes.push(elapsedMilliseconds);
  }

  // Mark our current time as the starting time for the next character
  v.persistent.startedCharTime = Isaac.GetTime();

  // Show the run summary (including the average time per character for the run so far)
  v.room.showEndOfRunText = true;
}
