import {
  EffectVariant,
  ModCallback,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getPlayers,
  isCharacter,
  movePlayersToCenter,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

/**
 * By default, the player starts near the bottom door at the beginning of a new run. Instead, put
 * the player in the middle of the room so that they have equal access to all 4 doors.
 *
 * This feature is not configurable because it could grant an advantage to turn off.
 */
export class CenterStart extends MandatoryModFeature {
  // 54, 15
  @Callback(ModCallback.POST_EFFECT_INIT, EffectVariant.POOF_1)
  postEffectInitPoof1(effect: EntityEffect): void {
    const gameFrameCount = game.GetFrameCount();

    // If players start the run with familiars, they will leave behind stray poofs when they get
    // moved.
    if (gameFrameCount === 0) {
      effect.Remove();

      // Even though we have removed it, it will still appear for a frame unless we make it
      // invisible.
      effect.Visible = false;
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    movePlayersToCenter();
    this.pickUpTaintedForgotten();
  }

  /**
   * By default, the `centerPlayers` function will put Tainted Forgotten on top of Tainted Soul, and
   * Tainted Soul will automatically pick up Tainted Forgotten after a short delay. Speed this up
   * slightly by manually making Tainted Soul pick up Tainted Forgotten.
   */
  pickUpTaintedForgotten(): void {
    for (const player of getPlayers()) {
      if (isCharacter(player, PlayerType.SOUL_B)) {
        const taintedForgotten = player.GetOtherTwin();
        if (taintedForgotten !== undefined) {
          player.TryHoldEntity(taintedForgotten);
        }
      }
    }
  }
}
