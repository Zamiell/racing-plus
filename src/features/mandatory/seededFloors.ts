// This feature is not configurable because it could change floors, causing a seed to be different

import { onSetSeed } from "isaacscript-common";
import g from "../../globals";

export function postGameStarted(): void {
  if (onSetSeed()) {
    // Remove certain trinkets that mess up floor generation
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SILVER_DOLLAR); // 110
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_BLOODY_CROWN); // 111
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_TELESCOPE_LENS); // 152
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_HOLY_CROWN); // 155
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_WICKED_CROWN); // 161
  }
}
