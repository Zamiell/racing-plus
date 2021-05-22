import g from "../globals";
import { getPlayers } from "../misc";

export function postGameStarted(): void {
  // This feature is not configurable because it could grant an advantage to turn off
  // Don't center the players in Greed Mode, since if the player starts at the center of the room,
  // they they will immediately touch the trigger button
  if (
    g.g.Difficulty === Difficulty.DIFFICULTY_NORMAL ||
    g.g.Difficulty === Difficulty.DIFFICULTY_HARD
  ) {
    centerPlayer();
  }
}

function centerPlayer() {
  const centerPos = g.r.GetCenterPos();

  // By default, the player starts near the bottom door
  // Instead, put the player in the middle of the room
  const players = getPlayers();
  if (players.length === 1) {
    g.p.Position = centerPos;
  } else {
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

  // Also, put familiars in the middle of the room, if any
  const familiars = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const familiar of familiars) {
    familiar.Position = centerPos;
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
