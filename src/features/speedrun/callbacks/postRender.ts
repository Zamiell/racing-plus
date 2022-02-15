import { log } from "isaacscript-common";
import g from "../../../globals";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../util/restartOnNextFrame";
import * as characterProgress from "../characterProgress";
import * as season2 from "../season2";
import { getCurrentCharacter, inSpeedrun } from "../speedrun";
import * as speedrunTimer from "../speedrunTimer";
import v from "../v";

const FADEOUT_SPEED = 0.0275;

export function speedrunPostRender(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkBeginFadeOutAfterCheckpoint();
  checkManualResetAtEndOfFadeout();

  speedrunTimer.postRender();
  characterProgress.postRender();

  season2.postRender();
}

function checkBeginFadeOutAfterCheckpoint() {
  const isaacFrameCount = Isaac.GetFrameCount();

  if (v.run.fadeFrame === null || isaacFrameCount < v.run.fadeFrame) {
    return;
  }

  // We grabbed the checkpoint, so fade out the screen before we reset
  v.run.fadeFrame = null;
  g.g.Fadeout(FADEOUT_SPEED, FadeoutTarget.RESTART_RUN);

  // If we do nothing, the game will now take us to the main menu
  // We can interrupt going to the menu by restarting the game on the frame before it happens
  // 69 is the latest frame that works, determined via trial and error
  // Doing this is necessary because we do not want the player to be able to reset to skip having to
  // watch the fade out animation
  v.run.resetFrame = isaacFrameCount + 69;
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
  restartOnNextFrame();
  const character = getCurrentCharacter();
  setRestartCharacter(character);
  log(
    `Switching to the next character for the speedrun: ${v.persistent.characterNum}`,
  );
}
