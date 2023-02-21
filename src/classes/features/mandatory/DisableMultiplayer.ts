import { FadeoutTarget, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, isMultiplayer } from "isaacscript-common";
import { MandatoryModFeature } from "../../MandatoryModFeature";

/**
 * Multiplayer is illegal in Racing+ races and custom challenges, so if multiplayer is detected, the
 * run is forcefully ended.
 */
export class DisableMultiplayer extends MandatoryModFeature {
  /**
   * - The `isMultiplayer` function does not work properly in the `POST_PLAYER_INIT` callback.
   * - If we use the `POST_PLAYER_INIT_FIRST` callback, then the players will be able to continue
   *   the run.
   *
   * Thus, we need to perform the check on every frame.
   */
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (!isMultiplayer()) {
      return;
    }

    const player = Isaac.GetPlayer();
    const sprite = player.GetSprite();
    const animation = sprite.GetAnimation();
    if (animation === "Sad") {
      // We are already fading out.
      return;
    }

    // Play an animation to let the player know that multiplayer is illegal.
    player.AnimateSad();

    game.Fadeout(0.04, FadeoutTarget.TITLE_SCREEN);
  }
}
