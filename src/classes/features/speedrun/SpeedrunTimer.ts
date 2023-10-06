import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  emptyArray,
  getElapsedRenderFramesSince,
  getScreenBottomY,
  rebirthItemTrackerRemoveCollectible,
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
    startedSpeedrunRenderFrame: null as int | null,
    startedCharacterRenderFrame: null as int | null,
    characterRunRenderFrames: [] as int[],
  },

  run: {
    finished: false,
    finishedSpeedrunRenderFrames: null as int | null,
    finishedCharacterRenderFrames: null as int | null,
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
    if (v.persistent.startedSpeedrunRenderFrame !== null) {
      return;
    }

    const renderFrameCount = Isaac.GetFrameCount();

    v.persistent.startedSpeedrunRenderFrame = renderFrameCount;
    v.persistent.startedCharacterRenderFrame = renderFrameCount;
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
    // Find out how much time has passed since the speedrun started.
    let elapsedFrames: int;
    if (v.run.finished && v.run.finishedSpeedrunRenderFrames !== null) {
      elapsedFrames = v.run.finishedSpeedrunRenderFrames;
    } else if (v.persistent.startedSpeedrunRenderFrame === null) {
      elapsedFrames = 0;
    } else {
      elapsedFrames = getElapsedRenderFramesSince(
        v.persistent.startedSpeedrunRenderFrame,
      );
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

    // Find out how much time has passed since the last "split" (e.g. when the last checkpoint was
    // touched).
    let elapsedFrames: int;
    if (v.run.finished && v.run.finishedCharacterRenderFrames !== null) {
      elapsedFrames = v.run.finishedCharacterRenderFrames;
    } else if (v.persistent.startedCharacterRenderFrame === null) {
      elapsedFrames = 0;
    } else {
      elapsedFrames = getElapsedRenderFramesSince(
        v.persistent.startedCharacterRenderFrame,
      );
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
  const totalFrames = sumArray(v.persistent.characterRunRenderFrames);
  const averageFrames =
    totalFrames / v.persistent.characterRunRenderFrames.length;
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
  return v.run.finishedSpeedrunRenderFrames ?? 0;
}

export function speedrunIsFinished(): boolean {
  return v.run.finished;
}

export function speedrunResetFirstCharacterVars(): void {
  const characterNum = speedrunGetCharacterNum();
  if (characterNum === 1) {
    v.persistent.startedSpeedrunRenderFrame = null;
    v.persistent.startedCharacterRenderFrame = null;
    emptyArray(v.persistent.characterRunRenderFrames);
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
  if (v.persistent.startedCharacterRenderFrame !== null) {
    const elapsedRenderFrames = getElapsedRenderFramesSince(
      v.persistent.startedCharacterRenderFrame,
    );
    v.persistent.characterRunRenderFrames.push(elapsedRenderFrames);
  }

  // Mark our current frame as the starting time for the next character.
  v.persistent.startedCharacterRenderFrame = renderFrameCount;

  // Show the run summary (including the average time per character for the run so far).
  v.room.showEndOfRunText = true;
}

/** When the player takes the trophy at the end of a multi-character speedrun. */
export function speedrunTimerFinish(player: EntityPlayer): void {
  sfxManager.Play(SoundEffectCustom.SPEEDRUN_FINISH);

  // Give them the Checkpoint custom item. (This is used by the LiveSplit auto-splitter to know when
  // to split.)
  player.AddCollectible(CollectibleTypeCustom.CHECKPOINT);
  rebirthItemTrackerRemoveCollectible(CollectibleTypeCustom.CHECKPOINT);

  // Record how long this run took.
  if (v.persistent.startedCharacterRenderFrame !== null) {
    const elapsedRenderFrames = getElapsedRenderFramesSince(
      v.persistent.startedCharacterRenderFrame,
    );
    v.persistent.characterRunRenderFrames.push(elapsedRenderFrames);
  }

  // Show the run summary (including the average time per character).
  v.room.showEndOfRunText = true;

  // Finish the speedrun.
  v.run.finished = true;

  if (v.persistent.startedSpeedrunRenderFrame !== null) {
    v.run.finishedSpeedrunRenderFrames = getElapsedRenderFramesSince(
      v.persistent.startedSpeedrunRenderFrame,
    );
  }

  if (v.persistent.startedCharacterRenderFrame !== null) {
    v.run.finishedCharacterRenderFrames = getElapsedRenderFramesSince(
      v.persistent.startedCharacterRenderFrame,
    );
  }

  speedrunResetAllVarsOnNextReset();

  // Fireworks will play on the next frame (from the `POST_UPDATE` callback).
}

export function speedrunTimerResetPersistentVars(): void {
  v.persistent.startedSpeedrunRenderFrame = null;
  v.persistent.startedCharacterRenderFrame = null;
  emptyArray(v.persistent.characterRunRenderFrames);
}
