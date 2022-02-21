import {
  getDeathAnimationName,
  getFinalFrameOfAnimation,
  getPlayerIndex,
} from "isaacscript-common";
import { SeededDeathState } from "../../../../types/SeededDeathState";
import {
  logSeededDeathStateChange,
  shouldSeededDeathApply,
} from "../seededDeath";
import v from "../v";

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
export function seededDeathPostPlayerRender(player: EntityPlayer): void {
  if (!shouldSeededDeathApply()) {
    return;
  }

  if (v.run.state !== SeededDeathState.WAITING_FOR_DEATH_ANIMATION_TO_FINISH) {
    return;
  }

  const playerIndex = getPlayerIndex(player);
  if (playerIndex !== v.run.dyingPlayerIndex) {
    return;
  }

  const sprite = player.GetSprite();
  const deathAnimation = getDeathAnimationName(player);
  if (!sprite.IsPlaying(deathAnimation)) {
    return;
  }

  const frame = sprite.GetFrame();
  const finalFrameOfDeathAnimation = getFinalFrameOfAnimation(sprite);
  if (frame !== finalFrameOfDeathAnimation) {
    return;
  }

  v.run.state = SeededDeathState.WAITING_FOR_NEW_ROOM;
  logSeededDeathStateChange();
}
