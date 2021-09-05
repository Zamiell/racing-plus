import { log } from "isaacscript-common";
import g from "../../../globals";
import { restartAsCharacter } from "../../../util";
import * as characterProgress from "../characterProgress";
import {
  checkValidCharOrder,
  getCurrentCharacter,
  inSpeedrun,
} from "../speedrun";
import * as speedrunTimer from "../speedrunTimer";
import v from "../v";

const FADEOUT_SPEED = 0.0275;

export default function speedrunPostRender(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkBeginFadeOutAfterCheckpoint();
  checkManualResetAtEndOfFadeout();

  speedrunTimer.postRender();
  characterProgress.postRender();
}

function checkBeginFadeOutAfterCheckpoint() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (v.run.fadeFrame === null || isaacFrameCount < v.run.fadeFrame) {
    return;
  }

  // We grabbed the checkpoint, so fade out the screen before we reset
  v.run.fadeFrame = null;
  g.g.Fadeout(FADEOUT_SPEED, FadeoutTarget.RESTART_RUN);

  // 72 restarts as the current character and we want a frame of leeway
  v.run.resetFrame = isaacFrameCount + 70;
  // (this is necessary because we don't want the player to be able to reset to skip having to
  // watch the fade out)
}

function checkManualResetAtEndOfFadeout() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (v.run.resetFrame === null || isaacFrameCount < v.run.resetFrame) {
    return;
  }

  // The screen is now black, so move us to the next character for the speedrun
  v.run.resetFrame = null;
  v.persistent.performedFastReset = true; // Otherwise we will go back to the beginning again
  v.persistent.characterNum += 1;
  g.run.restart = true;
  log(
    `Switching to the next character for the speedrun: ${v.persistent.characterNum}`,
  );
}

export function checkRestartWrongSpeedrunCharacter(): boolean {
  if (!inSpeedrun()) {
    return false;
  }

  if (!checkValidCharOrder()) {
    // The character order is not set properly; we will display an error to the user later on
    return false;
  }

  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const characterForThisSpeedrun = getCurrentCharacter();

  if (character === characterForThisSpeedrun) {
    return false;
  }

  restartAsCharacter(characterForThisSpeedrun);
  return true;
}