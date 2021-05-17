// Racing+ replaces the vanilla Challenge Rooms with a custom version

import { SPLITTING_BOSSES, ZERO_VECTOR } from "../constants";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import { EntityTypeCustom } from "../types/enums";
import * as bagFamiliars from "./bagFamiliars";
import * as fastClear from "./fastClear";

// For normal waves, each wave is specified by entity type && number of entities to spawn
const NORMAL_WAVES = [
  [
    // Basement / Cellar / Burning Basement
    [EntityType.ENTITY_GAPER, 4], // 10
    [EntityType.ENTITY_HORF, 3], // 12
    [EntityType.ENTITY_POOTER, 5], // 14
    [EntityType.ENTITY_CLOTTY, 2], // 15
    [EntityType.ENTITY_ATTACKFLY, 5], // 18
    [EntityType.ENTITY_HOPPER, 3], // 29
    [EntityType.ENTITY_FATTY, 3], // 208
    [EntityType.ENTITY_DIP, 5], // 217
    [EntityType.ENTITY_ROUND_WORM, 3], // 244
  ],
  [
    // Caves / Catacombs / Flooded Caves
    [EntityType.ENTITY_HIVE, 3], // 22
    [EntityType.ENTITY_CHARGER, 5], // 23
    [EntityType.ENTITY_GLOBIN, 4], // 24
    [EntityType.ENTITY_MAW, 4], // 26
    [EntityType.ENTITY_HOST, 3], // 27
    [EntityType.ENTITY_SPITY, 5], // 31
    [EntityType.ENTITY_BONY, 2], // 227
    [EntityType.ENTITY_TUMOR, 2], // 229
    [EntityType.ENTITY_GRUB, 1], // 239
    [EntityType.ENTITY_WALL_CREEP, 3], // 240
    [EntityType.ENTITY_ROUND_WORM, 4], // 244
    [EntityType.ENTITY_NIGHT_CRAWLER, 3], // 255
  ],
  [
    // Depths / Necropolis / Dank Depths
    [EntityType.ENTITY_GLOBIN, 4], // 24
    [EntityType.ENTITY_HOPPER, 5], // 29
    [EntityType.ENTITY_LEAPER, 4], // 34
    [EntityType.ENTITY_BABY, 4], // 38
    [EntityType.ENTITY_VIS, 3], // 39
    [EntityType.ENTITY_KNIGHT, 4], // 41
    [EntityType.ENTITY_FAT_SACK, 3], // 209
    [EntityType.ENTITY_MOMS_HAND, 3], // 213
    [EntityType.ENTITY_SQUIRT, 2], // 220
    [EntityType.ENTITY_BONY, 4], // 227
    [EntityType.ENTITY_NULLS, 3], // 252
  ],
  [
    // Womb / Utero / Scarred Womb / Cathedral / Sheol
    [EntityType.ENTITY_CLOTTY, 5], // 15
    [EntityType.ENTITY_BRAIN, 5], // 32
    [EntityType.ENTITY_MRMAW, 4], // 35
    [EntityType.ENTITY_BABY, 5], // 38
    [EntityType.ENTITY_VIS, 5], // 39
    [EntityType.ENTITY_LEECH, 5], // 55
    [EntityType.ENTITY_LUMP, 5], // 56
    [EntityType.ENTITY_PARA_BITE, 5], // 58
    [EntityType.ENTITY_FRED, 5], // 59
    [EntityType.ENTITY_EYE, 5], // 60
    [EntityType.ENTITY_SWINGER, 5], // 216
    [EntityType.ENTITY_TUMOR, 5], // 229
    [EntityType.ENTITY_RAGE_CREEP, 4], // 241
    [EntityType.ENTITY_FLESH_MOBILE_HOST, 5], // 247
  ],
];

// For boss waves, each wave is specified by entity type && entity variant
const BOSS_WAVES = [
  [
    // Basement / Cellar / Burning Basement
    [EntityType.ENTITY_LARRYJR, 0], // 19
    [EntityType.ENTITY_MONSTRO, 0], // 20
    [EntityType.ENTITY_PIN, 0], // 62
    [EntityType.ENTITY_FAMINE, 0], // 63
    [EntityType.ENTITY_DUKE, 0], // 67
    [EntityType.ENTITY_FISTULA_BIG, 0], // 71
    [EntityType.ENTITY_GEMINI, 0], // 79
    [EntityType.ENTITY_GEMINI, 1], // 79 (Steven)
    [EntityType.ENTITY_GEMINI, 2], // 79 (Blighted Ovum)
    [EntityType.ENTITY_WIDOW, 0], // 100
    [EntityType.ENTITY_GURGLING, 1], // 237 (boss variant)
    [EntityType.ENTITY_GURGLING, 2], // 237 (Turdlings)
    [EntityType.ENTITY_THE_HAUNT, 0], // 260
    [EntityType.ENTITY_DINGLE, 0], // 261
    [EntityType.ENTITY_DINGLE, 1], // 261 (Dangle)
    [EntityType.ENTITY_LITTLE_HORN, 0], // 404
    [EntityType.ENTITY_RAG_MAN, 0], // 405
  ],
  [
    // Caves / Catacombs / Flooded Caves
    [EntityType.ENTITY_LARRYJR, 1], // 19 (The Hollow)
    [EntityType.ENTITY_CHUB, 0], // 28
    [EntityType.ENTITY_CHUB, 1], // 28 (C.H.A.D.)
    [EntityType.ENTITY_CHUB, 2], // 28 (Carrion Queen)
    [EntityType.ENTITY_GURDY, 0], // 36
    [EntityType.ENTITY_PIN, 2], // 62 (Frail)
    [EntityType.ENTITY_PESTILENCE, 0], // 64
    [EntityType.ENTITY_DUKE, 1], // 67 (The Husk)
    [EntityType.ENTITY_PEEP, 0], // 68
    [EntityType.ENTITY_GURDY_JR, 0], // 99
    [EntityType.ENTITY_WIDOW, 1], // 100 (The Wretched)
    [EntityType.ENTITY_MEGA_MAW, 0], // 262
    [EntityType.ENTITY_MEGA_FATTY, 0], // 264
    [EntityType.ENTITY_DARK_ONE, 0], // 267
    [EntityType.ENTITY_POLYCEPHALUS, 0], // 269
    [EntityType.ENTITY_STAIN, 0], // 401
    [EntityType.ENTITY_FORSAKEN, 0], // 403
    [EntityType.ENTITY_RAG_MEGA, 0], // 409
    [EntityType.ENTITY_BIG_HORN, 0], // 411
  ],
  [
    // Depths / Necropolis / Dank Depths
    [EntityType.ENTITY_MONSTRO2, 0], // 43
    [EntityType.ENTITY_MONSTRO2, 1], // 43 (Gish)
    [EntityType.ENTITY_WAR, 0], // 65
    [EntityType.ENTITY_PEEP, 1], // 68 (The Bloat)
    [EntityType.ENTITY_LOKI, 0], // 69
    [EntityType.ENTITY_MASK_OF_INFAMY, 0], // 97
    [EntityType.ENTITY_GATE, 0], // 263
    [EntityType.ENTITY_CAGE, 0], // 265
    [EntityType.ENTITY_ADVERSARY, 0], // 268
    [EntityType.ENTITY_BROWNIE, 0], // 402
    [EntityType.ENTITY_SISTERS_VIS, 0], // 410
  ],
  [
    // Womb / Utero / Scarred Womb / Cathedral / Sheol
    [EntityType.ENTITY_PEEP, 1], // 68 (The Bloat)
    [EntityType.ENTITY_BLASTOCYST_BIG, 0], // 74
    [EntityType.ENTITY_DADDYLONGLEGS, 0], // 101
    [EntityType.ENTITY_DADDYLONGLEGS, 1], // 101 (Triachnid)
    [EntityType.ENTITY_LOKI, 1], // 69 (Lokii)
    [EntityType.ENTITY_MAMA_GURDY, 0], // 266
    [EntityType.ENTITY_MR_FRED, 0], // 270
    [EntityType.ENTITY_PIN, 1], // 62 (Scolex)
    [EntityType.ENTITY_FISTULA_BIG, 1], // 71 (Teratoma)
    [EntityType.ENTITY_WAR, 1], // 65 (War)
    [EntityType.ENTITY_DEATH, 0], // 66
    [EntityType.ENTITY_SISTERS_VIS, 0], // 410
    [EntityType.ENTITY_MATRIARCH, 0], // 413
  ],
];

const DELAY_FRAMES_IN_BETWEEN_WAVES = 15;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  // Local variables
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_CHALLENGE) {
    return;
  }

  checkStart();
  checkSpawnNewWave();
}

function checkStart() {
  if (
    g.run.room.touchedPickup &&
    !g.run.level.challengeRoom.started &&
    !g.run.level.challengeRoom.finished
  ) {
    start();
  }
}

function start() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const roomSeed = g.r.GetSpawnSeed();

  // The "ambush" is active and we have not started the Challenge Room yet, so start spawning mobs
  g.run.level.challengeRoom.started = true;
  g.run.level.challengeRoom.currentWave = 0;
  Isaac.DebugString(`Started the Challenge Room on frame: ${gameFrameCount}`);

  // Spawn a room clear delay NPC as a helper to keep the doors closed
  // (otherwise, the doors will re-open on every frame)
  const roomClearDelayNPC = Isaac.Spawn(
    EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    ZERO_VECTOR,
    ZERO_VECTOR,
    null,
  );
  roomClearDelayNPC.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
  roomClearDelayNPC.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  Isaac.DebugString(
    'Spawned the "Room Clear Delay NPC" custom entity (for a Challenge Room).',
  );

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

  // Get the specific waves for this particular Challenge Room
  let waveType = math.ceil(stage / 2); // e.g. Depths 1 is stage 5, which is wave type 3
  if (waveType > 4) {
    // Challenge Rooms in Cathedral & Sheol use Womb enemies/bosses
    waveType = 4;
  }
  let possibleWaves: int[][];
  let numWaves: int;
  if (stage % 2 === 0) {
    // Boss Challenge Room
    possibleWaves = BOSS_WAVES[waveType];
    numWaves = 2;
  } else {
    // Normal Challenge Room
    possibleWaves = NORMAL_WAVES[waveType];
    numWaves = 3;
  }

  g.run.level.challengeRoom.waves = [];
  let seed = roomSeed;
  const chosenWaveIndexes: int[] = [];
  while (g.run.level.challengeRoom.waves.length < numWaves) {
    seed = misc.incrementRNG(seed);
    math.randomseed(seed);
    const waveIndex = math.random(0, possibleWaves.length - 1);

    // Check to see if we already chose this wave
    if (chosenWaveIndexes.includes(waveIndex)) {
      continue;
    }

    const wave = possibleWaves[waveIndex];
    chosenWaveIndexes.push(waveIndex);
    g.run.level.challengeRoom.waves.push(wave);
  }
}

function checkSpawnNewWave() {
  if (!g.run.level.challengeRoom.started) {
    return;
  }

  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Don't do anything if we are in the short delay between waves
  if (g.run.level.challengeRoom.spawnWaveFrame !== 0) {
    if (gameFrameCount >= g.run.level.challengeRoom.spawnWaveFrame) {
      g.run.level.challengeRoom.spawnWaveFrame = 0;
      spawnWave();
    }

    return;
  }

  // Find out whether it is time to spawn the next wave
  // When the Challenge Room is active, the "Room Clear Delay NPC" boss will always be present,
  // which is why we check for equal to 1
  let spawnNextWave = false;
  if (g.run.fastClear.aliveEnemiesCount === 1) {
    // Every enemy is dead, but also check to see if any splitting enemies exist
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
    Isaac.DebugString(
      `Challenge Room wave ${g.run.level.challengeRoom.currentWave} finished on frame: ${gameFrameCount}`,
    );
  }
  if (!spawnNextWave) {
    return;
  }

  // The wave is clear, so give a charge to the active item(s)
  // (unless we are just starting the Challenge Room)
  if (g.run.level.challengeRoom.currentWave > 0) {
    fastClear.addCharge();
    schoolbag.addCharge(true);
    bagFamiliars.incrementRoomsCleared();
    bagFamiliars.checkSpawn();
  }

  // Find out if the Challenge Room is over
  if (
    g.run.level.challengeRoom.currentWave >=
    g.run.level.challengeRoom.waves.length
  ) {
    finish();
  } else {
    // Spawn the next wave after a short delay
    if (g.run.level.challengeRoom.currentWave > 0) {
      Isaac.DebugString(
        `Bosses defeated on frame. ${gameFrameCount.toString()}`,
      );
    }
    g.run.level.challengeRoom.spawnWaveFrame =
      gameFrameCount + DELAY_FRAMES_IN_BETWEEN_WAVES;
    g.run.level.challengeRoom.currentWave += 1;
    Isaac.DebugString(
      `Marking to spawn the next wave on frame. ${g.run.level.challengeRoom.spawnWaveFrame}`,
    );
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Local variables
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_CHALLENGE) {
    g.run.level.challengeRoom.started = false;
    g.run.level.challengeRoom.currentWave = 0;
    return;
  }

  // Ensure that the vanilla Challenge Room does not activate by setting it to be already cleared
  g.r.SetAmbushDone(true);

  // If we already started the Challenge Room and did not finish it,
  // and are now returning to the room, then start spawning the waves again from the beginning
  if (
    g.run.level.challengeRoom.started &&
    !g.run.level.challengeRoom.finished
  ) {
    g.run.level.challengeRoom.currentWave = 0;
    g.run.level.challengeRoom.spawnWaveFrame = 0;
    start();
  }
}

function spawnWave() {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  // For groups of 2
  const wavePositions2 = [
    misc.gridToPos(1, 3), // Near the left door
    misc.gridToPos(11, 3), // Near the right door
  ];

  // For groups of 3 enemies
  const wavePositions3 = [
    misc.gridToPos(1, 1), // Top left corner
    misc.gridToPos(1, 5), // Bottom left corner
    misc.gridToPos(11, 3), // Near the right door
  ];

  // For groups of 4 enemies || 5 enemies
  const wavePositions5 = [
    misc.gridToPos(1, 1), // Top left corner
    misc.gridToPos(11, 1), // Top right corner
    misc.gridToPos(1, 5), // Bottom left corner
    misc.gridToPos(11, 5), // Bottom right corner
    g.r.GetCenterPos(),
  ];

  // For normal waves, each wave is specified by entity type and number of entities to spawn
  // For boss waves, each wave is specified by entity type and entity variant
  const wave =
    g.run.level.challengeRoom.waves[g.run.level.challengeRoom.currentWave];
  const entityType = wave[0];
  let numEnemiesInWave = wave[1];
  let bossChallengeRoom = false;
  let entityVariant = 0;
  if (stage % 2 === 0) {
    // Boss Challenge Room
    bossChallengeRoom = true;
    entityVariant = numEnemiesInWave;
    numEnemiesInWave = 1;
  }

  for (let i = 1; i <= numEnemiesInWave; i++) {
    // We might need to spawn multiple of some bosses
    let numToSpawn = 1;
    if (wave[1] === EntityType.ENTITY_LARRYJR) {
      // 19
      // Larry Jr. and The Hollow have 10 segments
      numToSpawn = 10;
    } else if (wave[1] === EntityType.ENTITY_GURGLING) {
      // 237
      // Gurglings and Turdlings spawn in sets of 2
      // (this is how it is in vanilla Challenge Rooms)
      numToSpawn = 2;
    } else if (wave[1] === EntityType.ENTITY_GRUB) {
      // 239
      // Grub is similar to Larry Jr.
      numToSpawn = 6;
    }

    let position: Vector;
    let initialStep = 0;
    do {
      // Get a position to spawn the enemy at
      let startingPositionToUse: Vector;
      if (bossChallengeRoom || numEnemiesInWave === 1) {
        startingPositionToUse = g.r.GetCenterPos();
      } else if (numEnemiesInWave === 2) {
        startingPositionToUse = wavePositions2[i];
      } else if (numEnemiesInWave === 3) {
        startingPositionToUse = wavePositions3[i];
      } else {
        startingPositionToUse = wavePositions5[i];
      }
      position = g.r.FindFreePickupSpawnPosition(
        startingPositionToUse,
        initialStep,
        true,
      );

      initialStep += 1;
      if (initialStep >= 100) {
        break;
      }
    } while (position.Distance(g.p.Position) <= 120);
    // (ensure that we do not spawn a boss too close to the player))

    // Hard code Mama Gurdy to spawn at the top of the room to prevent glitchy behavior
    if (entityType === EntityType.ENTITY_MAMA_GURDY) {
      position = misc.gridToPos(6, 0);
    }

    for (let j = 1; j <= numToSpawn; j++) {
      if (bossChallengeRoom) {
        Isaac.Spawn(entityType, entityVariant, 0, position, ZERO_VECTOR, null);
      } else {
        Isaac.Spawn(entityType, 0, 0, position, ZERO_VECTOR, null);
      }
    }
  }

  // Play the summon sound
  g.sfx.Play(SoundEffect.SOUND_SUMMONSOUND, 1, 0, false, 1);

  Isaac.DebugString(
    `Spawned wave ${g.run.level.challengeRoom.currentWave} on frame: ${gameFrameCount}`,
  );
}

function finish() {
  g.run.level.challengeRoom.started = false;
  g.run.level.challengeRoom.finished = true;
  Isaac.DebugString("Custom Challenge Room finished.");

  // Spawn a random room drop
  g.r.SpawnClearAward();

  // Open the door
  const gridSize = g.r.GetGridSize();
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const door = gridEntity.ToDoor();
      if (door !== null) {
        if (
          !door.IsOpen() &&
          door.TargetRoomType !== RoomType.ROOM_SECRET && // 7
          door.TargetRoomType !== RoomType.ROOM_SUPERSECRET // 8
        ) {
          door.TryUnlock(true); // Doing "door.Open()" does not work
          g.sfx.Stop(SoundEffect.SOUND_UNLOCK00);
        }
      }
    }
  }

  // Play the sound effect for the doors opening
  g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN, 1, 0, false, 1);

  // Set the music back
  g.music.Fadein(Music.MUSIC_BOSS_OVER, 0); // 38
  g.music.UpdateVolume();
}

export function teleport(): void {
  // This is needed in case a player teleports from a Challenge room into the same Challenge Room
  g.run.level.challengeRoom.started = false;
  g.run.level.challengeRoom.currentWave = 0;
}
