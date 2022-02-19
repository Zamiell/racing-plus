// Planetariums have a greater chance of occurring if a Treasure Room is skipped,
// which can cause a divergence in seeded races
// In order to mitigate this, we force all players to visit every Treasure Room in seeded races

/*
export function shouldApplyPlanetariumFix(): boolean {
  return (
    g.race.format === RaceFormat.SEEDED &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  );
}
*/

// TODO
