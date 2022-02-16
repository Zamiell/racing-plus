import {
  enableAllInputs,
  ISAAC_FRAMES_PER_SECOND,
  isKeeper,
} from "isaacscript-common";
import * as timer from "../../../../timer";
import { SeededDeathState } from "../../../../types/SeededDeathState";
import { TimerType } from "../../../../types/TimerType";
import {
  logSeededDeathStateChange,
  shouldSeededDeathApply,
} from "../seededDeath";
import v from "../v";

// ModCallbacks.MC_POST_RENDER (2)
export function seededDeathPostRender(): void {
  if (!shouldSeededDeathApply()) {
    return;
  }

  postRenderFetalPosition();
  postRenderCheckDisplayTimer();
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

  enableAllInputs();

  // Since Keeper only has one coin container, he gets a bonus usage of Holy Card
  // We grant it here so that it does not cancel the "AppearVanilla" animation
  if (isKeeper(player)) {
    player.UseCard(Card.CARD_HOLY);
  }
}

function postRenderCheckDisplayTimer() {
  if (v.run.debuffEndFrame === null) {
    return;
  }

  const isaacFrameCount = Isaac.GetFrameCount();
  const remainingFrames = v.run.debuffEndFrame - isaacFrameCount;
  const seconds = remainingFrames / ISAAC_FRAMES_PER_SECOND;

  const startingX = 65;
  const startingY = 79;
  timer.display(TimerType.SEEDED_DEATH, seconds, startingX, startingY);
}
