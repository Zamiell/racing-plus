/*
export function main(entity: Entity): void {
  // Track which enemies are cleared for the purposes of the "fast-clear" feature
  fastClear.postEntityKill(entity);
  fadeKilledBosses(entity);
}

// When beginning a death animation, make bosses faded so that it makes it easier to see
function fadeKilledBosses(entity: Entity) {
  // We only want to fade bosses
  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }
  if (!npc.IsBoss()) {
    return;
  }

  // We don't want to fade multi-segment bosses since killing one segment will fade the rest of the
  // segments
  if (
    entity.Type === EntityType.ENTITY_LARRYJR || // 19 (and The Hollow)
    entity.Type === EntityType.ENTITY_PIN || // 62 (and Scolex / Frail)
    entity.Type === EntityType.ENTITY_GEMINI || // 79 (and Steven / Blighted Ovum)
    entity.Type === EntityType.ENTITY_HEART_OF_INFAMY // 98
  ) {
    return;
  }

  // Set the color to have an alpha of 0.4
  const faded = Color(1, 1, 1, 0.4, 0, 0, 0);
  entity.SetColor(faded, 1000, 0, true, true);
  // Priority doesn't matter, but a low duration won't work;
  // the longer the duration, the more fade, and a fade of 1000 looks nice
}

// EntityType.ENTITY_MOM (45)
export function mom(_entity: Entity): void {
  // There can be up to 5 Mom entities in the room,
  // so don't do anything if we have already spawned the photos
  if (g.run.momDied) {
    return;
  }
  g.run.momDied = true;

  // Prevent effects from spawning to fix lag
  g.run.room.preventBloodExplosion = true;
  Isaac.DebugString("Preventing blood explosions.");

  // Fix the (vanilla) bug with Globins, Sacks, etc.
  killExtraEnemies();
}

// EntityType.ENTITY_MOMS_HEART (78)
// EntityType.ENTITY_HUSH (407)
export function momsHeart(entity: Entity): void {
  // Local variables
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
  // a trapdoor and/or beam of light will spawn 1 frame from now, and we will delete it in the
  // fastTravel functions
  g.run.itLivesKillFrame = gameFrameCount;
  Isaac.DebugString(
    `Killed Mom's Heart / It Lives! / Hush on frame. ${gameFrameCount}`,
  );

  stage8paths.spawn(entity);

  // Prevent effects from spawning to fix lag
  g.run.room.preventBloodExplosion = true;
  Isaac.DebugString("Preventing blood explosions.");

  // Fix the (vanilla) bug with Globins, Sacks, etc.
  killExtraEnemies();

  // Finally, perform extra activities if we killed Hush
  if (entity.Type === EntityType.ENTITY_HUSH) {
    hushKilled();
  }
}

function hushKilled() {
  // Local variables
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

  if (g.race.status === "in progress" && g.race.goal === "Hush") {
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

// EntityType.ENTITY_FALLEN (81)
// We want to manually spawn the Krampus item instead of letting the game do it
// This slightly speeds up the spawn so that it can not be accidentally deleted by leaving the room
// Furthermore, it fixes the seeding issue where if you have Gimpy and Krampus drops a heart,
// the spawned pedestal to be moved one tile over,
// and this movement can cause the item to be different
export function fallen(entity: Entity): void {
  // The Fallen does not drop items
  if (entity.Variant !== 1) {
    return;
  }

  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Mark the frame that Krampus was killed so that we can manually
  // despawn it one frame before it drops the vanilla item
  const data = entity.GetData();
  data.killedFrame = gameFrameCount;

  // Krampus does not drop items in Racing+ Rebalanced
  if (RacingPlusRebalancedVersion !== null) {
    return;
  }

  // Figure out whether we should spawn the Lump of Coal of Krampus' Head
  const [coalBanned, headBanned] = getKrampusBans();

  // Find out what item to spawn
  const subType = getKrampusItemSubType(coalBanned, headBanned);

  // We have to prevent the bug where the pedestal item can overlap with a grid entity
  let position = entity.Position;
  const gridIndex = g.r.GetGridIndex(position);
  const gridEntity = g.r.GetGridEntity(gridIndex);
  if (gridEntity !== null) {
    position = g.r.FindFreePickupSpawnPosition(position, 1, false);
  }

  // Spawn the item
  // (it will get replaced on the next frame in the "Pedestals.Replace()" function)
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    subType,
    position,
    Vector.Zero,
    null,
  );
}

function getKrampusBans() {
  // Local variables
  const challenge = Isaac.GetChallenge();

  let coalBanned = false;
  let headBanned = false;

  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_LUMP_OF_COAL)) {
    coalBanned = true;
  }

  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS) ||
    g.run.schoolbag.item === CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS
  ) {
    headBanned = true;
  }

  if (g.race.status === "in progress") {
    for (const itemID of g.race.startingItems) {
      if (itemID === CollectibleType.COLLECTIBLE_LUMP_OF_COAL) {
        coalBanned = true;
      } else if (itemID === CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS) {
        headBanned = true;
      }
    }
  }

  if (challenge === ChallengeCustom.R7_SEASON_8) {
    if (
      g.season8.touchedItems.includes(CollectibleType.COLLECTIBLE_LUMP_OF_COAL)
    ) {
      coalBanned = true;
    }
    if (
      g.season8.touchedItems.includes(
        CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS,
      )
    ) {
      headBanned = true;
    }
  }

  return [coalBanned, headBanned];
}

function getKrampusItemSubType(coalBanned: boolean, headBanned: boolean) {
  // Local variables
  const startSeed = g.seeds.GetStartSeed();

  if (coalBanned && headBanned) {
    // Both A Lump of Coal and Krampus' Head are on the ban list, so make a random item instead
    return g.itemPool.GetCollectible(ItemPoolType.POOL_DEVIL, true, startSeed);
  }

  if (coalBanned) {
    return CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS;
  }

  if (headBanned) {
    return CollectibleType.COLLECTIBLE_LUMP_OF_COAL;
  }

  math.randomseed(startSeed);
  const seededChoice = math.random(1, 2);
  const coal = seededChoice === 1;
  if (coal) {
    return CollectibleType.COLLECTIBLE_LUMP_OF_COAL;
  }

  return CollectibleType.COLLECTIBLE_HEAD_OF_KRAMPUS;
}

// EntityType.ENTITY_URIEL (271)
// EntityType.ENTITY_GABRIEL (272)
// We want to manually spawn the key pieces instead of letting the game do it
// This slightly speeds up the spawn so that they can ! be accidentally deleted by leaving the room
export function urielGabriel(entity: Entity): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const challenge = Isaac.GetChallenge();

  // Fallen Angels do not drop items
  if (entity.Variant !== 0) {
    return;
  }

  // Mark the frame that the angel was killed on so that we can manually
  // despawn it one frame before it drops the vanilla item
  const data = entity.GetData();
  data.killedFrame = gameFrameCount;

  // We don't want to drop key pieces from angels in Victory Lap bosses or the Boss Rush
  if (
    roomType !== RoomType.ROOM_SUPERSECRET && // 8
    roomType !== RoomType.ROOM_SACRIFICE && // 13
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    // Key pieces dropping from angels in non-Angel Rooms was introduced in Booster Pack 4
    return;
  }

  // Do not drop any key pieces if the player already has both of them
  // (this matches the behavior of vanilla)
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1) && // 238
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2) && // 239
    !g.p.HasTrinket(TrinketType.TRINKET_FILIGREE_FEATHERS) // 123
  ) {
    return;
  }

  // Find out what type of key to spawn
  let subType = getUrielGabrielSubType(entity);

  if (challenge === ChallengeCustom.R7_SEASON_8) {
    // If we already got this key piece on a previous run,
    // then change it to a random Angel Room item
    if (g.season8.touchedItems.includes(subType)) {
      subType = CollectibleType.COLLECTIBLE_NULL;
    }
  }

  // We don't want to spawn it exactly where the angel died
  // in case it overlaps with another pedestal || a grid entity
  const pos = g.r.FindFreePickupSpawnPosition(entity.Position, 1, false);

  // Spawn the item
  // (it will get replaced on the next frame in the "Pedestals.Replace()" function)
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    subType,
    pos,
    Vector.Zero,
    null,
  );
}

function getUrielGabrielSubType(entity: Entity) {
  if (g.p.HasTrinket(TrinketType.TRINKET_FILIGREE_FEATHERS)) {
    // Even if the player has both key pieces,
    // Filigree Feather will still make an angel drop a random item (on vanilla and in R+)
    return CollectibleType.COLLECTIBLE_NULL; // A random item
  }

  if (
    entity.Type === EntityType.ENTITY_URIEL &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1)
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  if (
    entity.Type === EntityType.ENTITY_GABRIEL &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2)
  ) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  // In vanilla, angels will always drop their respective key piece
  // Since it is possible on Racing+ for two of the same angel to spawn,
  // ensure that an angel will drop the other key piece instead of dropping nothing
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_1)) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_2;
  }

  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_KEY_PIECE_2)) {
    return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
  }

  // Spawn key piece 1 by default
  return CollectibleType.COLLECTIBLE_KEY_PIECE_1;
}

// EntityType.ENTITY_ULTRA_GREED (406)
export function ultraGreed(entity: Entity): void {
  // In vanilla, he will turn into a gold statue and block movement,
  // which can block access to the Checkpoint
  // Instead, simply remove Ultra Greed as soon as he dies
  // (this also has the benefit of not forcing the player to watch the long death animation)
  entity.Remove();
}

export function roomClearDelayNPC(_entity: Entity): void {
  // The room clear delay NPC may accidentally die if Lua code kills all NPCs in a room
  // If this occurs, just spawn a new one
  Isaac.DebugString(
    "Room Clear Delay NPC death detected - spawning a new one.",
  );
  const npc = Isaac.Spawn(
    EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    Vector.Zero,
    Vector.Zero,
    null,
  );
  npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  npc.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
}

// After killing Mom, Mom's Heart, or It Lives!, all entities in the room are killed
// However, Nicalis didn't consider that Globins need to be killed twice
// (to kill their flesh pile forms)
// Blisters also need to be killed twice (to kill the spawned Sacks)
// Racing+ manually fixes this bug by explicitly killing them (and removing Fistula and Teratoma)
// This code is also necessary to fix the issue where a Globin will prevent the removal of the
// natural trapdoor and beam of light after It Lives!
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
