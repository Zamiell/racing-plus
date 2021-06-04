// This feature is not configurable because it could change trinket pools and cause a seed to be
// different

import g from "../../globals";
import { getPlayers } from "../../misc";

export function postGameStarted(): void {
  // Racing+ removes the Karma trinket from the game
  // (since all Donation Machines are removed, it has no purpose)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_KARMA);

  // If Eden started with the Karma trinket, we need to delete it
  for (const player of getPlayers()) {
    if (player.HasTrinket(TrinketType.TRINKET_KARMA)) {
      player.TryRemoveTrinket(TrinketType.TRINKET_KARMA);
    }
  }
}
