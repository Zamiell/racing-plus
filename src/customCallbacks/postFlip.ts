// This custom callback provides postFlip and postFirstFlip

import * as racePostFlip from "../features/race/callbacks/postFlip";
import g from "../globals";

export function useItem(): void {
  // The first time that Tainted Lazarus switches to Dead Tainted Lazarus,
  // we need to initialize all of the relevant player variables in the globals object
  if (!g.run.flippedAtLeastOnce) {
    g.run.flippedAtLeastOnce = true;
    racePostFlip.postFirstFlip();
  }

  racePostFlip.postFlip();
}
