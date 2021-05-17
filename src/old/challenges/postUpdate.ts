import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums";
import { inSpeedrun } from "./misc";
import * as season7 from "./season7";
import * as season8 from "./season8";

export function main(): void {
  if (!inSpeedrun()) {
    return;
  }

  if (RacingPlusData === undefined) {
    return;
  }

  // Check to see if we need to start the timers
  if (g.speedrun.startedTime === 0) {
    // We want to start the timer on the first game frame
    // (as opposed to when the screen is fading in)
    // Thus, we must check for this on every frame
    // This is to keep the timing consistent with historical timing of speedruns
    g.speedrun.startedTime = Isaac.GetTime();
    g.speedrun.startedFrame = Isaac.GetFrameCount();
    g.speedrun.startedCharTime = Isaac.GetTime();
  }

  checkCheckpointTouched();
  season7.checkUltraGreedSpawned();
  season8.postUpdate();
}

// Check to see if the player just picked up the "Checkpoint" custom item
function checkCheckpointTouched(forceGoToNextCharacter = false) {
  // Local variables
  const isaacFrameCount = Isaac.GetFrameCount();

  if (
    !forceGoToNextCharacter &&
    (g.p.QueuedItem.Item === null ||
      g.p.QueuedItem.Item.ID !== CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT ||
      g.run.seededDeath.state !== 0)
  ) {
    return;
  }

  if (g.speedrun.spawnedCheckpoint) {
    g.speedrun.spawnedCheckpoint = false;
  } else if (!forceGoToNextCharacter) {
    return;
  }

  // Give them the Checkpoint custom item
  // (this is used by the AutoSplitter to know when to split)
  g.p.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT, 0, false);
  Isaac.DebugString(
    `Checkpoint custom item given (${CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT}).`,
  );

  // Freeze the player
  g.p.ControlsEnabled = false;

  // Mark to fade out after the "Checkpoint" text has displayed on the screen for a little bit
  g.speedrun.fadeFrame = isaacFrameCount + 30;

  // Record how long this run took
  const elapsedMilliseconds = Isaac.GetTime() - g.speedrun.startedCharTime;
  g.speedrun.characterRunTimes.push(elapsedMilliseconds);

  // Mark our current time as the starting time for the next character
  g.speedrun.startedCharTime = Isaac.GetTime();

  // Show the run summary (including the average time per character for the run so far)
  g.run.endOfRunText = true;

  // Perform some additional actions for some specific seasons
  season7.checkpointTouched();
}
