// This custom callback provides postFlip and postFirstFlip

import * as startWithD6 from "../features/optional/major/startWithD6";
import * as racePostFlip from "../features/race/callbacks/postFlip";
import g from "../globals";
import { initPlayerVariables } from "../types/GlobalsRun";

export function useItem(): void {
  // The first time that Tainted Lazarus switches to Dead Tainted Lazarus,
  // we need to initialize all of the relevant player variables in the globals object
  if (!g.run.usedFlipAtLeastOnce) {
    g.run.usedFlipAtLeastOnce = true;
    postFirstFlip();
  }

  postFlip();
}

function postFirstFlip() {
  const player = Isaac.GetPlayer();

  initPlayerVariables(player, g.run);
  startWithD6.postPlayerChange(player);
  racePostFlip.postFirstFlip();
}

function postFlip() {}
