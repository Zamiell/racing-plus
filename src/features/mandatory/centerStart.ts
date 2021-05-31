// This feature is not configurable because it could grant an advantage to turn off

import g from "../../globals";
import { getPlayers, movePlayersAndFamiliars } from "../../misc";

export function postGameStarted(): void {
  centerPlayers();
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

  const players = getPlayers();
  if (players.length > 1) {
    // This is a multiplayer game,
    // so spread out the players in a circle around the center of the room
    const distanceBetweenPlayers = 50;
    const positions = distributeAround(
      centerPos,
      distanceBetweenPlayers,
      players.length,
    );
    for (let i = 0; i < players.length; i++) {
      players[i].Position = positions[i];
    }
  }
}

function distributeAround(centerPos: Vector, distance: int, numPoints: int) {
  const positions: Vector[] = [];
  const leftOfCenter = Vector(-distance, 0);
  for (let i = 0; i < numPoints; i++) {
    const rotatedPosition = leftOfCenter.Rotated((i * 360) / numPoints);
    const positionFromCenter = centerPos.__add(rotatedPosition);
    positions.push(positionFromCenter);
  }

  return positions;
}
