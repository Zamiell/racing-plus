// This custom callback provides postFlip and postFirstFlip

import g from "../globals";
import { initPlayerVariables } from "../types/GlobalsRun";

export function useItem(): void {
  // The first time that Tainted Lazarus switches to Dead Tainted Lazarus,
  // we need to initialize all of the relevant player variables in the globals object
  if (!g.run.flippedAtLeastOnce) {
    g.run.flippedAtLeastOnce = true;
    postFirstFlip();
  }

  postFlip();
}

function postFirstFlip() {
  const player = Isaac.GetPlayer();

  initPlayerVariables(player, g.run);
}

function postFlip() {}
