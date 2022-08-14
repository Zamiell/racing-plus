import { FadeoutTarget } from "isaac-typescript-definitions";
import { game, getCharacterName, log } from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../utils/restartOnNextFrame";
import * as characterProgress from "../characterProgress";
import { season2PostRender } from "../season2/callbacks/postRender";
import { season3PostRender } from "../season3/callbacks/postRender";
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

  season2PostRender();
  season3PostRender();
}

function checkBeginFadeOutAfterCheckpoint() {
  const renderFrameCount = Isaac.GetFrameCount();

  if (v.run.fadeFrame === null || renderFrameCount < v.run.fadeFrame) {
    return;
  }

  // We grabbed the checkpoint, so fade out the screen before we reset.
  v.run.fadeFrame = null;
  game.Fadeout(FADEOUT_SPEED, FadeoutTarget.RESTART_RUN);

  // If we do nothing, the game will now take us to the main menu. We can interrupt going to the
  // menu by restarting the game on the frame before it happens. 69 is the latest frame that works,
  // determined via trial and error. Doing this is necessary because we do not want the player to be
  // able to reset to skip having to watch the fade out animation.
  v.run.resetFrame = renderFrameCount + 69;
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

export function speedrunSetNextCharacterAndRestart(): void {
  const challenge = Isaac.GetChallenge();

  v.persistent.performedFastReset = true; // Otherwise we will go back to the beginning again
  v.persistent.characterNum++;
  restartOnNextFrame();
  log(`Speedrun: Now on character #${v.persistent.characterNum}.`);

  // Season 2 will set the next character using its own code.
  if (challenge !== ChallengeCustom.SEASON_2) {
    const character = getCurrentCharacter();
    setRestartCharacter(character);

    const characterName = getCharacterName(character);
    log(
      `Speedrun: Set the next character to be ${characterName} (${character}) and set to restart on the next frame.`,
    );
  }
}
