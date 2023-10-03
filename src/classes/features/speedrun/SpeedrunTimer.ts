import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  emptyArray,
  getScreenBottomY,
  removeCollectibleFromItemTracker,
  RENDER_FRAMES_PER_SECOND,
  RESOLUTION_FULL_SCREEN,
  sfxManager,
  sumArray,
} from "isaacscript-common";
import {
  RACE_TIMER_POSITION_X,
  RACE_TIMER_POSITION_Y,
} from "../../../constants";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { SoundEffectCustom } from "../../../enums/SoundEffectCustom";
import { TimerType } from "../../../enums/TimerType";
import { shouldDrawRaceTimer } from "../../../features/race/raceTimer";
import { config } from "../../../modConfigMenu";
import { CUSTOM_CHALLENGES_SET } from "../../../speedrun/constants";
import { convertSecondsToTimerValues, timerDraw } from "../../../timer";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import {
  isOnFirstCharacter,
  speedrunGetCharacterNum,
  speedrunResetAllVarsOnNextReset,
} from "./characterProgress/v";

const v = {
  persistent: {
    startedSpeedrunFrame: null as int | null,
    startedCharacterFrame: null as int | null,
    characterRunFrames: [] as int[],
  },

  run: {
    finished: false,
    finishedSpeedrunFrames: null as int | null,
    finishedCharacterFrames: null as int | null,
  },

  room: {
    showEndOfRunText: false,
  },
};

export class SpeedrunTimer extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkStartTimer();
  }

  /**
   * We want to start the timer on the first game frame, as opposed to when the screen is fading in.
   * Thus, we must check for this on every frame. This is to keep the timing consistent with
   * historical timing of speedruns.
   */
  checkStartTimer(): void {
    if (v.persistent.startedSpeedrunFrame !== null) {
      return;
    }

    const renderFrameCount = Isaac.GetFrameCount();

    v.persistent.startedSpeedrunFrame = renderFrameCount;
    v.persistent.startedCharacterFrame = renderFrameCount;
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // The speedrun timer is superfluous if we are doing a race, since the race timer will be shown
    // on the screen.
    if (shouldDrawRaceTimer()) {
      return;
    }

    this.drawSpeedrunTimer();
    this.drawSpeedrunCharacterTimer();
  }

  drawSpeedrunTimer(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    // Find out how much time has passed since the speedrun started.
    let elapsedFrames: int;
    if (v.run.finished && v.run.finishedSpeedrunFrames !== null) {
      elapsedFrames = v.run.finishedSpeedrunFrames;
    } else if (v.persistent.startedSpeedrunFrame === null) {
      elapsedFrames = 0;
    } else {
      elapsedFrames = renderFrameCount - v.persistent.startedSpeedrunFrame;
    }
    const seconds = elapsedFrames / RENDER_FRAMES_PER_SECOND;

    timerDraw(TimerType.RACE_OR_SPEEDRUN, seconds);
  }

  drawSpeedrunCharacterTimer(): void {
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
    if (v.run.finished && v.run.finishedCharacterFrames !== null) {
      elapsedFrames = v.run.finishedCharacterFrames;
    } else if (v.persistent.startedCharacterFrame === null) {
      elapsedFrames = 0;
    } else {
      elapsedFrames = renderFrameCount - v.persistent.startedCharacterFrame;
    }
    const seconds = elapsedFrames / RENDER_FRAMES_PER_SECOND;

    timerDraw(
      TimerType.SPEEDRUN_CHARACTER,
      seconds,
      RACE_TIMER_POSITION_X,
      RACE_TIMER_POSITION_Y + 15,
    );
  }
}

export function speedrunGetAverageTimePerCharacter(): string {
  const totalFrames = sumArray(v.persistent.characterRunFrames);
  const averageFrames = totalFrames / v.persistent.characterRunFrames.length;
  const averageSeconds = averageFrames / RENDER_FRAMES_PER_SECOND;

  const timerValues = convertSecondsToTimerValues(averageSeconds);
  if (timerValues === undefined) {
    return "unknown";
  }

  const { hours, minute1, minute2, second1, second2 } = timerValues;
  if (hours > 0) {
    return "too long";
  }

  return `${minute1}${minute2}.${second1}${second2}`;
}

export function speedrunGetFinishedFrames(): number {
  return v.run.finishedSpeedrunFrames ?? 0;
}

export function speedrunIsFinished(): boolean {
  return v.run.finished;
}

export function speedrunResetFirstCharacterVars(): void {
  const characterNum = speedrunGetCharacterNum();
  if (characterNum === 1) {
    v.persistent.startedSpeedrunFrame = null;
    v.persistent.startedCharacterFrame = null;
    emptyArray(v.persistent.characterRunFrames);
  }
}

export function speedrunShouldShowEndOfRunText(): boolean {
  return v.room.showEndOfRunText;
}

/**
 * When the player takes the "Checkpoint" custom item to move on to the next character in the
 * speedrun.
 */
export function speedrunTimerCheckpointTouched(): void {
  const renderFrameCount = Isaac.GetFrameCount();

  // Record how long this run took.
  if (v.persistent.startedCharacterFrame !== null) {
    const elapsedFrames = renderFrameCount - v.persistent.startedCharacterFrame;
    v.persistent.characterRunFrames.push(elapsedFrames);
  }

  // Mark our current frame as the starting time for the next character.
  v.persistent.startedCharacterFrame = renderFrameCount;

  // Show the run summary (including the average time per character for the run so far).
  v.room.showEndOfRunText = true;
}

/** When the player takes the trophy at the end of a multi-character speedrun. */
export function speedrunTimerFinish(player: EntityPlayer): void {
  const renderFrameCount = Isaac.GetFrameCount();

  sfxManager.Play(SoundEffectCustom.SPEEDRUN_FINISH);

  // Give them the Checkpoint custom item. (This is used by the LiveSplit auto-splitter to know when
  // to split.)
  player.AddCollectible(CollectibleTypeCustom.CHECKPOINT);
  removeCollectibleFromItemTracker(CollectibleTypeCustom.CHECKPOINT);

  // Record how long this run took.
  if (v.persistent.startedCharacterFrame !== null) {
    const elapsedFrames = renderFrameCount - v.persistent.startedCharacterFrame;
    v.persistent.characterRunFrames.push(elapsedFrames);
  }

  // Show the run summary (including the average time per character).
  v.room.showEndOfRunText = true;

  // Finish the speedrun.
  v.run.finished = true;

  if (v.persistent.startedSpeedrunFrame !== null) {
    v.run.finishedSpeedrunFrames =
      renderFrameCount - v.persistent.startedSpeedrunFrame;
  }

  if (v.persistent.startedCharacterFrame !== null) {
    v.run.finishedCharacterFrames =
      renderFrameCount - v.persistent.startedCharacterFrame;
  }

  speedrunResetAllVarsOnNextReset();

  // Fireworks will play on the next frame (from the `POST_UPDATE` callback).
}

export function speedrunTimerResetPersistentVars(): void {
  v.persistent.startedSpeedrunFrame = null;
  v.persistent.startedCharacterFrame = null;
  emptyArray(v.persistent.characterRunFrames);
}
