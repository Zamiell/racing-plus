// Automatically open the Mega Satan door on races with a Mega Satan goal

import g from "../../../globals";

export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const player = Isaac.GetPlayer();

  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "Mega Satan"
  ) {
    return;
  }

  if (stage === 11) {
    const topDoor = g.r.GetDoor(1);
    if (topDoor !== null) {
      topDoor.TryUnlock(player, true);
    }
  }
}
