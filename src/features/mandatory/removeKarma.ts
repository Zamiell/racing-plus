// This feature is not configurable because it could change trinket pools and cause a seed to be
// different

import g from "../../globals";

export function postGameStarted(): void {
  const character = g.p.GetPlayerType();

  // Racing+ removes the Karma trinket from the game
  // (since all Donation Machines are removed, it has no purpose)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_KARMA);

  // If Eden started with the Karma trinket, we need to delete it
  if (
    (character === PlayerType.PLAYER_EDEN ||
      character === PlayerType.PLAYER_EDEN_B) &&
    g.p.HasTrinket(TrinketType.TRINKET_KARMA)
  ) {
    g.p.TryRemoveTrinket(TrinketType.TRINKET_KARMA);
  }
}
