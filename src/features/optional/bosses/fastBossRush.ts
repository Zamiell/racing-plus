import {
  CollectibleType,
  EntityFlag,
  EntityType,
  GameStateFlag,
  LarryJrVariant,
  MamaGurdyVariant,
  Music,
  PickupVariant,
  PinVariant,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  anyPlayerCloserThan,
  copySet,
  findFreePosition,
  game,
  getAllBossesSet,
  getNPCs,
  getRandomArrayElement,
  gridCoordinatesToWorldPosition,
  log,
  logError,
  musicManager,
  newRNG,
  openAllDoors,
  parseEntityTypeVariantString,
  repeat,
  saveDataManager,
  sfxManager,
  spawnCollectible,
  spawnNPC,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { EntityTypeCustom } from "../../../enums/EntityTypeCustom";
import { RaceGoal } from "../../../enums/RaceGoal";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import g from "../../../globals";
import { setStreakText } from "../../mandatory/streakText";
import {
  getFastClearNumAliveBosses,
  getFastClearNumAliveEnemies,
} from "../major/fastClear/v";

const SPLITTING_BOSS_ENTITY_TYPE_SET = new Set([
  EntityType.FISTULA_BIG, // 71
  EntityType.FISTULA_MEDIUM, // 72
  EntityType.FISTULA_SMALL, // 73
  EntityType.BLASTOCYST_BIG, // 74
  EntityType.BLASTOCYST_MEDIUM, // 75
  EntityType.BLASTOCYST_SMALL, // 76
  EntityType.FALLEN, // 81
  EntityType.BROWNIE, // 402
]);

/**
 * Krampus, Uriel, and Gabriel are not included in the boss set from the standard library, so we do
 * not have to exclude them. (We want to exclude them since they will drop items.)
 */
const BOSS_RUSH_EXCLUSIONS: readonly string[] = [
  // Tuff Twins and The Shell require bombs to kill.
  `${EntityType.LARRY_JR}.${LarryJrVariant.TUFF_TWIN}`, // 19.2
  `${EntityType.LARRY_JR}.${LarryJrVariant.THE_SHELL}`, // 19.3

  // Scolex is not a balanced boss for speedruns.
  `${EntityType.PIN}.${PinVariant.SCOLEX}`, // 62.1

  // Wormwood requires water to function correctly.
  `${EntityType.PIN}.${PinVariant.WORMWOOD}`, // 62.3

  // Mama Gurdy does not play well in a 2x2 room due to needing to be on the top wall.
  `${EntityType.MAMA_GURDY}.${MamaGurdyVariant.MAMA_GURDY}`, // 266.0

  // Reap Creep does not play well in a 2x2 room due to needing to be on the top wall.
  `${EntityType.REAP_CREEP}.0`, // 900.0

  // Hornfel requires tracks to function correctly.
  `${EntityType.HORNFEL}.0`, // 906.0

  // Great Gideon would not work properly in a Boss Rush room.
  `${EntityType.GREAT_GIDEON}.0`, // 907.0
];

const BOSS_RUSH_BOSSES = getBossRushBosses();

function getBossRushBosses(): readonly string[] {
  const bossSet = copySet(getAllBossesSet(false));

  for (const entityTypeVariantString of BOSS_RUSH_EXCLUSIONS) {
    bossSet.delete(entityTypeVariantString);
  }

  return [...bossSet.values()];
}

/** In vanilla, it spawns 2 bosses at a time for 15 waves. */
const NUM_TOTAL_BOSSES = 30;

/**
 * In vanilla it is 2, but we increase this to 3 in Racing+ so that the Boss Rush can be completed
 * faster.
 */
const NUM_BOSSES_PER_WAVE = 3;

const NUM_GAME_FRAMES_BETWEEN_WAVES = 20;

const v = {
  run: {
    started: false,
    finished: false,
    currentWave: 0,
    spawnWaveGameFrame: 0,

    /**
     * An array of entity type + variant strings, matching the format of the boss set from the
     * standard library.
     */
    selectedBosses: [] as string[],
  },
};

export function init(): void {
  saveDataManager("fastBossRush", v);
}

export function postUpdate(): void {
  checkSpawnNextWave();
}

function checkSpawnNextWave() {
  if (!v.run.started) {
    return;
  }

  // Don't do anything if we are in the short delay between waves.
  const gameFrameCount = game.GetFrameCount();
  if (v.run.spawnWaveGameFrame !== 0) {
    if (gameFrameCount >= v.run.spawnWaveGameFrame) {
      v.run.spawnWaveGameFrame = 0;
      spawnNextWave();
    }

    return;
  }

  const totalBossesDefeatedIfWaveIsClear =
    v.run.currentWave * NUM_BOSSES_PER_WAVE;

  if (!isWaveComplete(totalBossesDefeatedIfWaveIsClear)) {
    return;
  }

  log(
    `Boss Rush wave ${v.run.currentWave} completed. Total bosses defeated so far: ${totalBossesDefeatedIfWaveIsClear}`,
  );

  // TODO: Give charge if necessary.

  // Find out if the Boss Rush is over.
  if (totalBossesDefeatedIfWaveIsClear >= NUM_TOTAL_BOSSES) {
    finish();
  } else {
    // Spawn the next wave after a short delay.
    v.run.spawnWaveGameFrame = gameFrameCount + NUM_GAME_FRAMES_BETWEEN_WAVES;
    v.run.currentWave++;
  }
}

function spawnNextWave() {
  const gameFrameCount = game.GetFrameCount();

  for (let i = 0; i < NUM_BOSSES_PER_WAVE; i++) {
    // Get the boss to spawn.
    const bossIndex =
      v.run.currentWave * NUM_BOSSES_PER_WAVE - NUM_BOSSES_PER_WAVE + i;
    const bossString = v.run.selectedBosses[bossIndex];
    if (bossString === undefined) {
      logError(
        `Failed to find the selected Boss Rush boss at index: ${bossIndex}`,
      );
      continue;
    }
    const tuple = parseEntityTypeVariantString(bossString);
    if (tuple === undefined) {
      logError(`Failed to parse the selected Boss Rush boss: ${bossString}`);
      continue;
    }
    const [entityType, variant] = tuple;

    const numSegments = getNumBossSegments(entityType);
    const position = getBossSpawnPosition(i);

    repeat(numSegments, () => {
      spawnNPC(entityType, variant, 0, position);

      // Clutch is a special case; he is always accompanied by 3 Clickety Clacks.
      if (entityType === EntityType.CLUTCH) {
        repeat(3, () => {
          spawnNPC(EntityType.CLICKETY_CLACK, 0, 0, position);
        });
      }
    });
  }

  sfxManager.Play(SoundEffect.SUMMON_SOUND);

  // Display the wave number as streak text.
  const totalWaves = math.floor(NUM_TOTAL_BOSSES / NUM_BOSSES_PER_WAVE);
  setStreakText(`Wave ${v.run.currentWave} / ${totalWaves}`);

  log(
    `Spawned Boss Rush wave ${v.run.currentWave} on game frame: ${gameFrameCount}`,
  );
}

function getNumBossSegments(entityType: EntityType): int {
  if (entityType === EntityType.LARRY_JR || entityType === EntityType.TURDLET) {
    return 10;
  }

  if (entityType === EntityType.CHUB) {
    return 3;
  }

  // Gurglings and Turdlings spawn in sets of 3. (This is how it is in the vanilla Boss Rush.)
  if (entityType === EntityType.GURGLING) {
    return 3;
  }

  return 1;
}

function getBossSpawnPosition(bossNum: int): Vector {
  const bossPositions: readonly Vector[] = [
    gridCoordinatesToWorldPosition(7, 6), // Left of the items
    gridCoordinatesToWorldPosition(18, 7), // Right of the items
    gridCoordinatesToWorldPosition(12, 2), // Above the items
    /// gridCoordinatesToWorldPosition(13, 11), // Below the items (currently unused)
  ];

  const basePosition = bossPositions[bossNum];
  if (basePosition === undefined) {
    error(`Failed to get the base boss position for boss number: ${bossNum}`);
  }

  for (let i = 0; i < 100; i++) {
    const position = g.r.FindFreePickupSpawnPosition(basePosition, i, true);

    const gridEntity = g.r.GetGridEntityFromPos(position);

    // Ensure that we do not spawn a boss too close to the player or on top of red poop. (For some
    // reason, the `Room.FindFreePickupSpawnPosition` method will return positions that overlap with
    // red poop from Carrion Queen.)
    if (!anyPlayerCloserThan(position, 120) && gridEntity === undefined) {
      return position;
    }
  }

  // If we have not found a valid position after 100 iterations, something has gone wrong. Default
  // to spawning the boss at the base position.
  return basePosition;
}

function isWaveComplete(totalBossesDefeatedIfWaveIsClear: int): boolean {
  // If this is the final wave, then we only want to proceed if every enemy is killed, not just the
  // bosses.
  if (totalBossesDefeatedIfWaveIsClear >= NUM_TOTAL_BOSSES) {
    const numAliveEnemies = getNumAliveEnemies();
    if (numAliveEnemies > 0) {
      return false;
    }

    // Allow splitting enemies to produce their offspring.
    return !doSplittingBossesExist();
  }

  // This is not the final wave, so only count alive bosses.
  const numAliveBosses = getNumAliveBosses();
  if (numAliveBosses > 0) {
    return false;
  }

  // Allow splitting enemies to produce their offspring.
  return !doSplittingBossesExist();
}

/**
 * This accounts for the "Room Clear Delay NPC" that we spawn to prevent the vanilla bosses from
 * spawning.
 */
function getNumAliveEnemies(): int {
  const numAliveEnemies = getFastClearNumAliveEnemies();
  return numAliveEnemies - 1;
}

/**
 * This accounts for the "Room Clear Delay NPC" that we spawn to prevent the vanilla bosses from
 * spawning.
 */
function getNumAliveBosses(): int {
  const numAliveBosses = getFastClearNumAliveBosses();
  return numAliveBosses - 1;
}

function doSplittingBossesExist(): boolean {
  const npcs = getNPCs();
  return npcs.some((npc) => SPLITTING_BOSS_ENTITY_TYPE_SET.has(npc.Type));
}

function finish() {
  v.run.started = false;
  v.run.finished = true;
  game.SetStateFlag(GameStateFlag.BOSS_RUSH_DONE, true);
  Isaac.DebugString("Custom Boss Rush finished.");

  spawnBossRushFinishReward();
  openAllDoors();
  sfxManager.Play(SoundEffect.DOOR_HEAVY_OPEN);

  // Because of the emulated Boss Rush, the battle music will continue to play.
  musicManager.Crossfade(Music.BOSS_OVER);

  // Announce the completion via streak text.
  setStreakText("Complete!");
}

function spawnBossRushFinishReward() {
  const roomSeed = g.r.GetSpawnSeed();
  const centerPos = g.r.GetCenterPos();
  const challenge = Isaac.GetChallenge();

  const position = findFreePosition(centerPos, true);
  if (challenge === ChallengeCustom.SEASON_3) {
    // The big chest will get replaced with either a checkpoint or a trophy on the next frame.
    spawnPickup(PickupVariant.BIG_CHEST, 0, position);
    return;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH
  ) {
    // The big chest will get replaced with a trophy on the next frame.
    spawnPickup(PickupVariant.BIG_CHEST, 0, position);
  }

  spawnCollectible(CollectibleType.NULL, position, roomSeed);
}

// ModCallbackCustom.POST_AMBUSH_STARTED
// AmbushType.BOSS_RUSH
export function postAmbushStartedBossRush(): void {
  startCustomBossRush();
}

function startCustomBossRush() {
  v.run.started = true;
  v.run.currentWave = 0;
  v.run.selectedBosses = getRandomBossRushBosses();

  // Now that the vanilla Boss Rush has been triggered, we need to prevent the vanilla bosses from
  // spawning. This is accomplished by immediately spawning a dummy boss, because the game will wait
  // for it to be killed before spawning the first wave. (Note that the "Room Clear Delay Effect"
  // does not work and a non-boss NPC does not work.)
  const roomClearDelayNPC = spawnNPC(
    EntityTypeCustom.ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    VectorZero,
  );
  roomClearDelayNPC.ClearEntityFlags(EntityFlag.APPEAR);
}

function getRandomBossRushBosses(): string[] {
  const startSeed = g.seeds.GetStartSeed();
  const rng = newRNG(startSeed);

  const randomBosses: string[] = [];

  repeat(NUM_TOTAL_BOSSES, () => {
    const randomBoss = getRandomArrayElement(
      BOSS_RUSH_BOSSES,
      rng,
      randomBosses,
    );
    randomBosses.push(randomBoss);
  });

  return randomBosses;
}
