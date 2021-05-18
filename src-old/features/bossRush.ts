// Racing+ replaces the vanilla Boss Rush with a custom version

import { ChallengeCustom } from "../challenges/constants";
import { SPLITTING_BOSSES, Vector.Zero } from "../constants";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import { EntityTypeCustom } from "../types/enums";
import * as bagFamiliars from "./bagFamiliars";
import * as fastClear from "./fastClear";

const BOSS_LIST: Array<[int, int]> = [
  [19, 0], // Larry Jr.
  [19, 1], // The Hollow
  [20, 0], // Monstro
  [28, 0], // Chub
  [28, 1], // C.H.A.D.
  [28, 2], // Carrion Queen
  [36, 0], // Gurdy
  [43, 0], // Monstro II
  [43, 1], // Gish
  [62, 0], // Pin
  [62, 2], // Frail
  [63, 0], // Famine
  [64, 0], // Pestilence
  [65, 0], // War
  [65, 1], // Conquest
  [66, 0], // Death
  [67, 0], // The Duke of Flies
  [67, 1], // The Husk
  [68, 0], // Peep
  [68, 1], // The Bloat
  [69, 0], // Loki
  [69, 1], // Lokii
  [71, 0], // Fistula
  [71, 1], // Teratoma
  [74, 0], // Blastocyst
  [79, 0], // Gemini
  [79, 1], // Steven
  [79, 2], // The Blighted Ovum
  [81, 0], // The Fallen
  [82, 0], // The Headless Horseman
  [97, 0], // Mask of Infamy
  [99, 0], // Gurdy Jr.
  [100, 0], // Widow
  [100, 1], // The Wretched
  [101, 0], // Daddy Long Legs
  [101, 1], // Triachnid
  [237, 1], // Gurglings
  [237, 2], // Turdling
  [260, 0], // The Haunt
  [261, 0], // Dingle
  [261, 1], // Dangle
  [262, 0], // Mega Maw
  [263, 0], // The Gate
  [264, 0], // Mega Fatty
  [265, 0], // The Cage
  [266, 0], // Mama Gurdy
  [267, 0], // Dark One
  [268, 0], // The Adversary
  [269, 0], // Polycephalus
  [270, 0], // Mr. Fred
  [271, 0], // Uriel
  [272, 0], // Gabriel
  [401, 0], // The Stain
  [402, 0], // Brownie
  [403, 0], // The Forsaken
  [404, 0], // Little Horn
  [405, 0], // Rag Man
  [409, 0], // Rag Mega
  [410, 0], // Sisters Vis
  [411, 0], // Big Horn
  [413, 0], // The Matriarch
];

const TOTAL_BOSSES = 30; // In vanilla, it spawns 2 bosses at a time for 15 waves
const DELAY_FRAMES_IN_BETWEEN_WAVES = 20;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  // Local variables
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_BOSSRUSH) {
    return;
  }

  checkStart();
  checkSpawnNewWave();
}

function checkStart() {
  if (
    g.run.room.touchedPickup &&
    !g.run.bossRush.started &&
    !g.run.bossRush.finished
  ) {
    start();
  }
}

function start() {
  // Local variables
  const roomDescriptor = g.l.GetCurrentRoomDesc();
  const roomData = roomDescriptor.Data;
  const roomVariant = roomData.Variant;
  const startSeed = g.seeds.GetStartSeed();

  // We have touched an item and have not started the Boss Rush yet, so start spawning mobs
  g.run.bossRush.started = true;
  g.run.bossRush.currentWave = 0;

  // Spawn a room clear delay NPC as a helper to keep the doors closed
  // (otherwise, the doors will re-open on every frame)
  const roomClearDelayNPC = Isaac.Spawn(
    EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    Vector.Zero,
    Vector.Zero,
    null,
  );
  roomClearDelayNPC.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
  roomClearDelayNPC.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;

  // Close the door
  const gridSize = g.r.GetGridSize();
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const door = gridEntity.ToDoor();
      if (door !== null) {
        door.Close(true);
      }
    }
  }

  // Start the music
  g.music.Fadein(Music.MUSIC_CHALLENGE_FIGHT, 0);
  g.music.UpdateVolume();

  // Calculate the bosses for each wave
  g.run.bossRush.bosses = [];
  let seed = startSeed;
  const chosenBossIndexes: int[] = [];
  while (g.run.bossRush.bosses.length < TOTAL_BOSSES) {
    seed = misc.incrementRNG(seed);
    math.randomseed(seed);
    const bossIndex = math.random(0, BOSS_LIST.length - 1);

    // Check to see if we already chose this boss
    if (chosenBossIndexes.includes(bossIndex)) {
      continue;
    }

    const boss = BOSS_LIST[bossIndex];
    const entityType = boss[0];

    // Check to see if the boss would be blocked by rocks at the top of the screen
    if (
      roomVariant === 3 &&
      (entityType === EntityType.ENTITY_THE_HAUNT || // 260
        entityType === EntityType.ENTITY_MAMA_GURDY || // 266
        entityType === EntityType.ENTITY_MEGA_MAW || // 262
        entityType === EntityType.ENTITY_GATE) // 263
    ) {
      continue;
    }

    chosenBossIndexes.push(bossIndex);
    g.run.bossRush.bosses.push(boss);
  }
}

function checkSpawnNewWave() {
  if (!g.run.bossRush.started) {
    return;
  }

  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const challenge = Isaac.GetChallenge();
  let bossesPerWave = 2;
  if (challenge === ChallengeCustom.R7_SEASON_7) {
    bossesPerWave = 3;
  }
  const totalBossesDefeatedIfWaveIsClear =
    g.run.bossRush.currentWave * bossesPerWave;

  // Don't do anything if we are in the short delay between waves
  if (g.run.bossRush.spawnWaveFrame !== 0) {
    if (gameFrameCount >= g.run.bossRush.spawnWaveFrame) {
      g.run.bossRush.spawnWaveFrame = 0;
      spawnWave(bossesPerWave);
    }

    return;
  }

  // Find out whether it is time to spawn the next wave
  // If this is the final wave, then we only want to proceed if every enemy is killed
  // (not just the bosses)
  // When the Boss Rush is active, the "Room Clear Delay NPC" boss will always be present,
  // which is why we check for equal to 1 instead of equal to 0
  let spawnNextWave = false;
  if (totalBossesDefeatedIfWaveIsClear >= TOTAL_BOSSES) {
    if (g.run.fastClear.aliveEnemiesCount === 1) {
      // Every enemy is dead, but also check to see if ( any splitting enemies exist
      let splittingBossExists = false;
      for (const entity of Isaac.GetRoomEntities()) {
        if (SPLITTING_BOSSES.includes(entity.Type)) {
          splittingBossExists = true;
          break;
        }
      }
      if (splittingBossExists) {
        return;
      }

      // No splitting enemies exist, so consider the encounter finished
      spawnNextWave = true;
      Isaac.DebugString(`All bosses killed on frame: ${gameFrameCount}`);
    }
  } else if (g.run.fastClear.aliveBossesCount === 0) {
    spawnNextWave = true;
    Isaac.DebugString(
      `Bosses for this wave were defeated on frame: ${gameFrameCount}`,
    );
  }
  if (!spawnNextWave) {
    return;
  }

  // All of the bosses for this wave have been defeated, so give a charge to the active item(s)
  // (unless we are just starting the Boss Rush)
  if (g.run.bossRush.currentWave > 0) {
    fastClear.addCharge();
    schoolbag.addCharge(true);
    bagFamiliars.incrementRoomsCleared();
    bagFamiliars.checkSpawn();
  }

  // Find out if the Boss Rush is over
  Isaac.DebugString(
    `Total bosses defeated so far: ${totalBossesDefeatedIfWaveIsClear}`,
  );
  if (totalBossesDefeatedIfWaveIsClear >= TOTAL_BOSSES) {
    finish();
  } else {
    // Spawn the next wave after a short delay
    if (g.run.bossRush.currentWave > 0) {
      Isaac.DebugString(`Bosses defeated on frame: ${gameFrameCount}`);
    }
    g.run.bossRush.spawnWaveFrame =
      gameFrameCount + DELAY_FRAMES_IN_BETWEEN_WAVES;
    g.run.bossRush.currentWave += 1;
    Isaac.DebugString(
      `Marking to spawn the next wave on frame: ${g.run.bossRush.spawnWaveFrame}`,
    );
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Local variables
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_BOSSRUSH) {
    g.run.bossRush.started = false;
    g.run.bossRush.currentWave = 0;
    return;
  }

  // Ensure that the vanilla Boss Rush does not activate by setting it to be already cleared
  g.r.SetAmbushDone(true);

  // If we already started the Boss Rush and did not finish it,
  // we are now returning to the room, then start spawning the waves again from the beginning
  if (g.run.bossRush.started && !g.run.bossRush.finished) {
    g.run.bossRush.currentWave = 0;
    g.run.bossRush.spawnWaveFrame = 0;
    start();
  }
}

function spawnWave(bossesPerWave: int) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  const bossPos = [
    misc.gridToPos(7, 6), // Left of the items
    misc.gridToPos(18, 7), // Right of the items
    misc.gridToPos(12, 2), // Above the items
    // misc.gridToPos(13, 11), // Below the items (currently unused)
  ];

  for (let i = 1; i <= bossesPerWave; i++) {
    // Get the boss to spawn
    const bossIndex =
      g.run.bossRush.currentWave * bossesPerWave - bossesPerWave + i;
    const boss = g.run.bossRush.bosses[bossIndex];
    const [entityType, entityVariant] = boss;

    // Find out how many to spawn
    let numToSpawn = 1;
    if (entityType === EntityType.ENTITY_LARRYJR) {
      // 19
      // Larry Jr. and The Hollow have 10 segments
      numToSpawn = 10;
    } else if (entityType === EntityType.ENTITY_GURGLING) {
      // 237
      // Gurglings and Turdlings spawn in sets of 3
      // (this is how it is in the vanilla Boss Rush)
      numToSpawn = 3;
    }

    let position: Vector;
    let initialStep = 0;
    do {
      // If this is the first boss, spawn it to the left of the items
      // If this is the second boss, spawn it to the right of the items
      // If this is the third boss, spawn it above the items
      position = g.r.FindFreePickupSpawnPosition(bossPos[i], initialStep, true);

      initialStep += 1;
      if (initialStep >= 100) {
        break;
      }
    } while (position.Distance(g.p.Position) <= 120);
    // (ensure that we do not spawn a boss too close to the player)

    // Hard code Mama Gurdy to spawn at the top of the room to prevent glitchy behavior
    if (entityType === EntityType.ENTITY_MAMA_GURDY) {
      position = misc.gridToPos(12, 0);
    }

    for (let j = 1; j <= numToSpawn; j++) {
      Isaac.Spawn(entityType, entityVariant, 0, position, Vector.Zero, null);
    }
  }

  // Play the summon sound
  g.sfx.Play(SoundEffect.SOUND_SUMMONSOUND, 1, 0, false, 1);

  // Display the wave number as streak text
  const totalWaves = math.floor(TOTAL_BOSSES / bossesPerWave);
  g.run.streakText = `Wave ${g.run.bossRush.currentWave} / ${totalWaves}`;

  g.run.streakFrame = Isaac.GetFrameCount();

  Isaac.DebugString(
    `Spawned wave ${g.run.bossRush.currentWave} on frame: ${gameFrameCount}`,
  );
}

function finish() {
  // Local variables
  const roomSeed = g.r.GetSpawnSeed();
  const centerPos = g.r.GetCenterPos();
  const challenge = Isaac.GetChallenge();

  g.run.bossRush.started = false;
  g.run.bossRush.finished = true;
  g.g.SetStateFlag(GameStateFlag.STATE_BOSSRUSH_DONE, true);
  Isaac.DebugString("Custom Boss Rush finished.");

  const pos = g.r.FindFreePickupSpawnPosition(g.r.GetCenterPos(), 1, true);
  if (
    challenge === ChallengeCustom.R7_SEASON_7 ||
    (g.race.status === "in progress" && g.race.goal === "Boss Rush")
  ) {
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
  } else {
    // Spawn a random item
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      pos,
      Vector.Zero,
      null,
      0,
      roomSeed,
    );
  }

  misc.openAllDoors();

  // Play the sound effect for the doors opening
  g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0, false, 1);

  // Set the music back
  g.music.Fadein(Music.MUSIC_BOSS_OVER, 0);
  g.music.UpdateVolume();

  // Announce the completion via streak text
  g.run.streakText = "Complete!";
  g.run.streakFrame = Isaac.GetFrameCount();
}
