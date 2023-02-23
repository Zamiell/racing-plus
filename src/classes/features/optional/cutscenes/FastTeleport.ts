import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const ANIMATION_SPEED_MULTIPLIER = 1.66;

/** The vanilla teleport animations are annoyingly slow, so speed them up by a factor of 2. */
export class FastTeleport extends ConfigurableModFeature {
  configKey: keyof Config = "FastTeleport";

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): void {
    const sprite = player.GetSprite();
    const animation = sprite.GetAnimation();
    if (
      (animation === "TeleportUp" || animation === "TeleportDown") &&
      sprite.PlaybackSpeed === 1
    ) {
      sprite.PlaybackSpeed = ANIMATION_SPEED_MULTIPLIER;
    }
  }
}
