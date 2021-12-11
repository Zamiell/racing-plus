// Planetariums have a greater chance of occurring if a Treasure Room is skipped,
// which can cause a divergence in seeded races
// In order to mitigate this, we force all players to visit every Treasure Room in seeded races
// The file shares code with "showDreamCatcherItem/callbacks/postNewRoom.ts"

import g from "../../globals";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

export function shouldApplyPlanetariumFix(): boolean {
  return (
    g.race.format === RaceFormat.SEEDED &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  );
}
