/*

export function main(): void {
  checkVictoryLapBossReplace();
}

function checkVictoryLapBossReplace() {
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();

  // Check to see if we need to spawn Victory Lap bosses
  if (
    g.raceVars.finished &&
    !roomClear &&
    roomStageID === StageID.SPECIAL_ROOMS &&
    // Blue Baby
    (roomVariant === 3390 ||
      roomVariant === 3391 ||
      roomVariant === 3392 ||
      roomVariant === 3393 ||
      // The Lamb
      roomVariant === 5130)
  ) {
    // Replace Blue Baby or The Lamb with some random bosses (based on the number of Victory Laps)
    const isaacs = Isaac.FindByType(EntityType.ENTITY_ISAAC);
    removeAllEntities(isaacs);
    const lambs = Isaac.FindByType(EntityType.ENTITY_THE_LAMB);
    removeAllEntities(lambs);

    let randomBossSeed = roomSeed;
    const numBosses = g.raceVars.victoryLaps + 1;
    for (let i = 1; i <= numBosses; i++) {
      randomBossSeed = misc.incrementRNG(randomBossSeed);
      math.randomSeed(randomBossSeed);
      const randomBossIndex = math.random(0, VICTORY_LAP_BOSSES.length - 1);
      const randomBoss = VICTORY_LAP_BOSSES[randomBossIndex];
      if (randomBoss[0] === EntityType.ENTITY_LARRYJR) {
        // Larry Jr. and The Hollow require multiple segments
        for (let j = 1; j <= 6; j++) {
          spawnBoss(randomBoss);
        }
      } else {
        spawnBoss(randomBoss);
      }
    }
    Isaac.DebugString(
      `Replaced Blue Baby / The Lamb with ${numBosses} random bosses.`,
    );
  }
}

function spawnBoss(bossArray: [int, int, int]) {
  const [entityType, variant, subType] = bossArray;
  Isaac.Spawn(
    entityType,
    variant,
    subType,
    g.r.GetCenterPos(),
    Vector.Zero,
    null,
  );
}

*/
