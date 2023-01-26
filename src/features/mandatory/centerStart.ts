// By default, the player starts near the bottom door at the beginning of a new run. Instead, put
// the player in the middle of the room so that they have equal access to all 4 doors.

// This feature is not configurable because it could grant an advantage to turn off.

import { PlayerType } from "isaac-typescript-definitions";
import {
  game,
  getPlayers,
  isCharacter,
  movePlayersToCenter,
} from "isaacscript-common";

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  movePlayersToCenter();
  pickUpTaintedForgotten();
}

/**
 * By default, the `centerPlayers` function will put Tainted Forgotten on top of Tainted Soul, and
 * Tainted Soul will automatically pick up Tainted Forgotten after a short delay. Speed this up
 * slightly by manually making Tainted Soul pick up Tainted Forgotten.
 */
function pickUpTaintedForgotten() {
  for (const player of getPlayers()) {
    if (isCharacter(player, PlayerType.SOUL_B)) {
      const taintedForgotten = player.GetOtherTwin();
      if (taintedForgotten !== undefined) {
        player.TryHoldEntity(taintedForgotten);
      }
    }
  }
}

// ModCallback.POST_EFFECT_INIT (54)
export function poof01(effect: EntityEffect): void {
  const gameFrameCount = game.GetFrameCount();

  // If players start the run with familiars, they will leave behind stray poofs when they get
  // moved.
  if (gameFrameCount === 0) {
    effect.Remove();

    // Even though we have removed it, it will still appear for a frame unless we make it invisible.
    effect.Visible = false;
  }
}
