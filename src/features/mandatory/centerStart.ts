// By default, the player starts near the bottom door at the beginning of a new run
// Instead, put the player in the middle of the room so that they have equal access to all 4 doors
// This feature is not configurable because it could grant an advantage to turn off

import {
  getCircleDiscretizedPoints,
  getPlayers,
  isCharacter,
} from "isaacscript-common";
import g from "../../globals";
import { movePlayersAndFamiliars } from "../../utils";

const CIRCLE_RADIUS_BETWEEN_PLAYERS = 50;

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  centerPlayers();
  pickUpTaintedForgotten();
}

export function centerPlayers(): void {
  const isGreedMode = g.g.IsGreedMode();
  const centerPos = g.r.GetCenterPos();

  // In Greed Mode, we cannot put the player in the center of the room,
  // because they would immediately touch the trigger button
  if (isGreedMode) {
    return;
  }

  movePlayersAndFamiliars(centerPos);

  const players = getPlayers(true); // Don't include secondary players

  // If this is a multiplayer game, spread out the players in a circle around the center of the room
  if (players.length > 1) {
    const circlePoints = getCircleDiscretizedPoints(
      centerPos,
      CIRCLE_RADIUS_BETWEEN_PLAYERS,
      players.length,
      1,
      1,
      Direction.LEFT,
    );
    players.forEach((player, i) => {
      player.Position = circlePoints[i];
    });
  }
}

function pickUpTaintedForgotten() {
  // By default, the "centerPlayers()" function will put Tainted Forgotten on top of Tainted Soul,
  // and Tainted Soul will automatically pick up Tainted Forgotten after a short delay
  // Speed this up slightly by manually making Tainted Soul pick up Tainted Forgotten
  for (const player of getPlayers()) {
    if (isCharacter(player, PlayerType.PLAYER_THESOUL_B)) {
      const taintedForgotten = player.GetOtherTwin();
      if (taintedForgotten !== undefined) {
        player.TryHoldEntity(taintedForgotten);
      }
    }
  }
}

// ModCallbacks.MC_POST_EFFECT_INIT (54)
export function poof01(effect: EntityEffect): void {
  const gameFrameCount = g.g.GetFrameCount();

  // If players start the run with familiars, they will leave behind stray poofs when they get moved
  if (gameFrameCount === 0) {
    effect.Remove();

    // Even though we have removed it, it will still appear for a frame unless we make it invisible
    effect.Visible = false;
  }
}
