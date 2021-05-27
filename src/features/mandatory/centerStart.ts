// This feature is not configurable because it could grant an advantage to turn off

import g from "../../globals";
import { getPlayers, movePlayersAndFamiliars } from "../../misc";

export function postGameStarted(): void {
  centerPlayers();
}

export function centerPlayers(): void {
  const centerPos = g.r.GetCenterPos();

  // Don't center the players in Greed Mode, since if the player starts at the center of the room,
  // they they will immediately touch the trigger button
  if (g.g.IsGreedMode()) {
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

  // If Eden starts with a familiar, it will appear in a puff of smoke
  // Delete the puff of smoke that betrays where the familiar really spawned
  const poofs = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.POOF01,
    -1,
    false,
    false,
  );
  for (const poof of poofs) {
    poof.Remove();
    poof.Visible = false;
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
