// Automatically open Mega Satan door on Mega Satan goal

import g from "../../../globals";

export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();

  if (stage === 11) {
    const topDoor = g.r.GetDoor(1);
    if (topDoor !== null) {
      topDoor.TryUnlock(player, true);
    }
  }
}
