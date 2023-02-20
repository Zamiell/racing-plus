import { FadeoutTarget, ModCallback } from "isaac-typescript-definitions";
import { Callback, game, isMultiplayer } from "isaacscript-common";
import { MandatoryModFeature } from "../../MandatoryModFeature";

/**
 * Multiplayer is illegal in Racing+ races and custom challenges, so if multiplayer is detected, the
 * run is forcefully ended.
 */
export class DisableMultiplayer extends MandatoryModFeature {
  @Callback(ModCallback.POST_PLAYER_INIT) // 9
  postPlayerInit(): void {
    if (isMultiplayer()) {
      // Play an animation to let the player know that multiplayer is illegal.
      const player = Isaac.GetPlayer();
      player.AnimateSad();

      game.Fadeout(0.05, FadeoutTarget.TITLE_SCREEN);
    }
  }
}
