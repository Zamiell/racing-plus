import {
  enableAllInputs,
  ISAAC_FRAMES_PER_SECOND,
  isKeeper,
} from "isaacscript-common";
import * as timer from "../../../../timer";
import { ChallengeCustom } from "../../../../types/ChallengeCustom";
import { SeededDeathState } from "../../../../types/SeededDeathState";
import { TimerType } from "../../../../types/TimerType";
import {
  SEEDED_DEATH_FEATURE_NAME,
  SEEDED_DEATH_TIMER_SEASON_OFFSET_X,
  SEEDED_DEATH_TIMER_STARTING_X,
  SEEDED_DEATH_TIMER_STARTING_Y,
} from "../constants";
import {
  logSeededDeathStateChange,
  shouldSeededDeathFeatureApply,
} from "../seededDeath";
import v from "../v";

// ModCallbacks.MC_POST_RENDER (2)
export function seededDeathPostRender(): void {
  if (!shouldSeededDeathFeatureApply()) {
    return;
  }

  postRenderFetalPosition();
  postRenderCheckDrawTimer();
}

function postRenderFetalPosition() {
  if (v.run.state !== SeededDeathState.FETAL_POSITION) {
    return;
  }

  const player = Isaac.GetPlayer();
  const sprite = player.GetSprite();

  if (sprite.IsPlaying("AppearVanilla")) {
    return;
  }

  v.run.state = SeededDeathState.GHOST_FORM;
  logSeededDeathStateChange();

  enableAllInputs(SEEDED_DEATH_FEATURE_NAME);

  // Since Keeper only has one coin container, he gets a bonus usage of Holy Card
  // We grant it here so that it does not cancel the "AppearVanilla" animation
  if (isKeeper(player)) {
    player.UseCard(Card.CARD_HOLY);
  }
}

function postRenderCheckDrawTimer() {
  if (v.run.debuffEndFrame === null) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const challenge = Isaac.GetChallenge();

  const remainingFrames = v.run.debuffEndFrame - isaacFrameCount;
  const seconds = remainingFrames / ISAAC_FRAMES_PER_SECOND;

  let startingX = SEEDED_DEATH_TIMER_STARTING_X;
  const startingY = SEEDED_DEATH_TIMER_STARTING_Y;

  if (challenge === ChallengeCustom.SEASON_2) {
    startingX += SEEDED_DEATH_TIMER_SEASON_OFFSET_X;
  }

  timer.draw(TimerType.SEEDED_DEATH, seconds, startingX, startingY);
}
