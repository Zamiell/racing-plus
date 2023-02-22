import {
  getScreenBottomY,
  RENDER_FRAMES_PER_SECOND,
  RESOLUTION_FULL_SCREEN,
} from "isaacscript-common";
import { RACE_TIMER_POSITION_X, RACE_TIMER_POSITION_Y } from "../../constants";
import { TimerType } from "../../enums/TimerType";
import { config } from "../../modConfigMenu";
import * as timer from "../../timer";
import { shouldDrawRaceTimer } from "../race/raceTimer";
import { isOnFirstCharacter } from "./speedrun";
import { v } from "./v";

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  // The speedrun timer is superfluous if we are doing a race, since the race timer will be shown on
  // the screen.
  if (shouldDrawRaceTimer()) {
    return;
  }

  drawSpeedrunTimer();
  drawSpeedrunCharacterTimer();
}

function drawSpeedrunTimer() {
  const renderFrameCount = Isaac.GetFrameCount();

  // Find out how much time has passed since the speedrun started.
  let elapsedFrames: int;
  if (v.run.finished && v.run.finishedFrames !== null) {
    elapsedFrames = v.run.finishedFrames;
  } else if (v.persistent.startedSpeedrunFrame === null) {
    elapsedFrames = 0;
  } else {
    elapsedFrames = renderFrameCount - v.persistent.startedSpeedrunFrame;
  }
  const seconds = elapsedFrames / RENDER_FRAMES_PER_SECOND;

  timer.draw(TimerType.RACE_OR_SPEEDRUN, seconds);
}

function drawSpeedrunCharacterTimer() {
  if (!config.CharacterTimer) {
    return;
  }

  // If we are on the first character, the two timers would be identical.
  if (isOnFirstCharacter()) {
    return;
  }

  // If the resolution is too tiny, the second timer would overlap with the trinket UI.
  const screenBottomY = getScreenBottomY();
  if (screenBottomY < RESOLUTION_FULL_SCREEN.Y) {
    return;
  }

  const renderFrameCount = Isaac.GetFrameCount();

  // Find out how much time has passed since the last "split" (e.g. when the last checkpoint was
  // touched).
  let elapsedFrames: int;
  if (v.run.finished && v.run.finishedFrames !== null) {
    elapsedFrames = v.run.finishedFrames;
  } else if (v.persistent.startedCharacterFrame === null) {
    elapsedFrames = 0;
  } else {
    elapsedFrames = renderFrameCount - v.persistent.startedCharacterFrame;
  }
  const seconds = elapsedFrames / RENDER_FRAMES_PER_SECOND;

  timer.draw(
    TimerType.SPEEDRUN_CHARACTER,
    seconds,
    RACE_TIMER_POSITION_X,
    RACE_TIMER_POSITION_Y + 15,
  );
}
