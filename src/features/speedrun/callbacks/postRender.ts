import { FadeoutTarget } from "isaac-typescript-definitions";
import { game, getCharacterName, log } from "isaacscript-common";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../utils/restartOnNextFrame";
import * as characterProgress from "../characterProgress";
import * as randomCharacterOrder from "../randomCharacterOrder";
import { season2PostRender } from "../season2/callbacks/postRender";
import { season3PostRender } from "../season3/callbacks/postRender";
import * as season4 from "../season4";
import { getCurrentCharacter, inSpeedrun } from "../speedrun";
import * as speedrunTimer from "../speedrunTimer";
import v, { speedrunHasErrors } from "../v";

const FADEOUT_SPEED = 0.0275;

/**
 * After using the `Game.Fadeout` method, we will be taken to the main menu. We can interrupt this
 * by restarting the game on the frame before the fade out ends. 69 is the latest frame that works,
 * determined via trial and error. Doing this is necessary because we do not want the player to be
 * able to reset to skip having to watch the fade out animation.
 */
const DELAY_FRAMES_AFTER_FADEOUT = 69;

export function speedrunPostRender(): void {
  if (!inSpeedrun()) {
    return;
  }

  checkBeginFadeOutAfterCheckpoint();
  checkManualResetAtEndOfFadeout();

  speedrunTimer.postRender();
  characterProgress.postRender();
  randomCharacterOrder.postRender();

  if (speedrunHasErrors()) {
    return;
  }

  season2PostRender();
  season3PostRender();
  season4.postRender();
}

function checkBeginFadeOutAfterCheckpoint() {
  const renderFrameCount = Isaac.GetFrameCount();

  if (v.run.fadeFrame === null || renderFrameCount < v.run.fadeFrame) {
    return;
  }

  // We grabbed the checkpoint, so fade out the screen before we reset.
  v.run.fadeFrame = null;
  game.Fadeout(FADEOUT_SPEED, FadeoutTarget.RESTART_RUN);
  v.run.resetFrame = renderFrameCount + DELAY_FRAMES_AFTER_FADEOUT;
}

function checkManualResetAtEndOfFadeout() {
  const renderFrameCount = Isaac.GetFrameCount();

  if (v.run.resetFrame === null || renderFrameCount < v.run.resetFrame) {
    return;
  }
  v.run.resetFrame = null;

  // The screen is now black, so move us to the next character for the speedrun.
  speedrunSetNextCharacterAndRestart();
}

function speedrunSetNextCharacterAndRestart() {
  v.persistent.performedFastReset = true; // Otherwise we will go back to the beginning again
  v.persistent.characterNum++;
  restartOnNextFrame();
  log(`Speedrun: Now on character #${v.persistent.characterNum}.`);

  // Speedruns with a random character order will set the next character using its own code.
  if (!randomCharacterOrder.isSpeedrunWithRandomCharacterOrder()) {
    const character = getCurrentCharacter();
    setRestartCharacter(character);

    const characterName = getCharacterName(character);
    log(
      `Speedrun: Set the next character to be ${characterName} (${character}) and set to restart on the next frame.`,
    );
  }
}
