// This custom callback provides postFlip and postFirstFlip

import * as startWithD6 from "../features/optional/major/startWithD6";
import * as racePostFlip from "../features/race/callbacks/postFlip";
import g from "../globals";
import { initPlayerVariables } from "../types/GlobalsRun";

export function main(): void {
  const player = Isaac.GetPlayer();

  initPlayerVariables(player, g.run);
  startWithD6.postFirstFlip(player);
  racePostFlip.postFirstFlip(player);
}
