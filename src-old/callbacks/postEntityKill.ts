/*
// EntityType.ENTITY_MOM (45)
export function mom(_entity: Entity): void {
  // There can be up to 5 Mom entities in the room,
  // so don't do anything if we have already spawned the photos
  if (g.run.momDied) {
    return;
  }
  g.run.momDied = true;

  // Fix the (vanilla) bug with Globins, Sacks, etc.
  killExtraEnemies();
}

// EntityType.ENTITY_MOMS_HEART (78)
// EntityType.ENTITY_HUSH (407)
export function momsHeart(entity: Entity): void {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  // Don't do anything if we are fighting Mom's Heart / It Lives on The Void
  if (stage === 12) {
    return;
  }

  // For some reason, Mom's Heart / It Lives! will die twice in a row on two subsequent frames
  // (this does not happen on Hush)
  // We do not want to do anything if this is the first time it died
  if (stage !== 9 && gameFrameCount - g.run.itLivesKillFrame > 1) {
    g.run.itLivesKillFrame = gameFrameCount;
    Isaac.DebugString(
      `Killed Mom's Heart / It Lives! / Hush (fake first death) on frame: ${gameFrameCount}`,
    );
    return;
  }

  // Record when we killed It Lives! or Hush;
  // a trapdoor and/or heaven door will spawn 1 frame from now, and we will delete it in the
  // fastTravel functions
  g.run.itLivesKillFrame = gameFrameCount;
  Isaac.DebugString(
    `Killed Mom's Heart / It Lives! / Hush on frame. ${gameFrameCount}`,
  );

  stage8paths.spawn(entity);

  // Fix the (vanilla) bug with Globins, Sacks, etc.
  killExtraEnemies();

  // Finally, perform extra activities if we killed Hush
  if (entity.Type === EntityType.ENTITY_HUSH) {
    hushKilled();
  }
}

function hushKilled() {
  const centerPos = g.r.GetCenterPos();
  const challenge = Isaac.GetChallenge();

  // Season 7 speedruns end at Hush
  if (challenge === ChallengeCustom.R7_SEASON_7) {
    // Spawn a big chest
    // (which will get replaced with either a checkpoint or a trophy on the next frame)
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BIGCHEST,
      0,
      centerPos,
      Vector.Zero,
      null,
    );
    return;
  }

  // Manually open the Void door
  g.r.TrySpawnTheVoidDoor();

  if (g.race.status === "in progress" && g.race.myStatus === "racing" && g.race.goal === "Hush") {
    // Spawn a big chest (which will get replaced with a trophy on the next frame)
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BIGCHEST,
      0,
      centerPos,
      Vector.Zero,
      null,
    );
  }
}

// EntityType.ENTITY_ULTRA_GREED (406)
export function ultraGreed(entity: Entity): void {
  // In vanilla, he will turn into a gold statue and block movement,
  // which can block access to the Checkpoint
  // Instead, simply remove Ultra Greed as soon as he dies
  // (this also has the benefit of not forcing the player to watch the long death animation)
  entity.Remove();
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
