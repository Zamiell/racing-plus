/*

// EntityType.ENTITY_MOM (45)
export function mom(_entity: Entity): void {
  // There can be up to 5 Mom entities in the room,
  // so don't do anything if we have already spawned the photos
  if (g.room.momDied) {
    return;
  }
  g.room.momDied = true;

  // Fix the (vanilla) bug with Globins, Sacks, etc.
  killExtraEnemies();
}

// EntityType.ENTITY_MOMS_HEART (78)
// EntityType.ENTITY_HUSH (407)
export function momsHeart(entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  // Fix the (vanilla) bug with Globins, Sacks, etc.
  killExtraEnemies();
}

// After killing Mom, Mom's Heart, or It Lives!, all entities in the room are killed
// However, the developers did not consider that Globins need to be killed twice
// (to kill their flesh pile forms)
// Blisters also need to be killed twice (to kill the spawned Sacks)
// Racing+ manually fixes this bug by explicitly killing them (and removing Fistula and Teratoma)
// This code is also necessary to fix the issue where a Globin will prevent the removal of the
// natural trapdoor and heaven door after It Lives!
// (in the fast travel replacement functions)
function killExtraEnemies() {
  Isaac.DebugString(
    "Checking for extra enemies to kill after a Mom / It Lives! fight.",
  );
  for (const entity of Isaac.GetRoomEntities()) {
    if (
      entity.Type === EntityType.ENTITY_GLOBIN || // 24
      entity.Type === EntityType.ENTITY_BOIL || // 30
      entity.Type === EntityType.ENTITY_FISTULA_BIG || // 71 (also includes Teratoma)
      entity.Type === EntityType.ENTITY_FISTULA_MEDIUM || // 72 (also includes Teratoma)
      entity.Type === EntityType.ENTITY_FISTULA_SMALL || // 73 (also includes Teratoma)
      entity.Type === EntityType.ENTITY_BLISTER // 303
    ) {
      // Removing it just causes it to disappear, which looks buggy,
      // so show a small blood explosion as well
      entity.BloodExplode();
      entity.Remove();
      Isaac.DebugString("Manually removed an enemy after Mom / It Lives!");
    }
  }
}

*/
