import { log } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const ANIMATION_SPEED_MULTIPLIER = 1.66;

// ModCallback.POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  if (!config.fastTeleports) {
    return;
  }

  // The vanilla teleport animations are annoyingly slow, so speed them up by a factor of 2.
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  if (
    (animation === "TeleportUp" || animation === "TeleportDown") &&
    sprite.PlaybackSpeed === 1
  ) {
    sprite.PlaybackSpeed = ANIMATION_SPEED_MULTIPLIER;
    log(`Increased the playback speed of a ${animation} animation.`);
  }
}
