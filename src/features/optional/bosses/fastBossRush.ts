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
  RoomType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  addRoomClearCharges,
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
  ReadonlySet,
  repeat,
  sfxManager,
  spawnNPC,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import { EntityTypeCustom } from "../../../enums/EntityTypeCustom";
import { RaceGoal } from "../../../enums/RaceGoal";
import { RacerStatus } from "../../../enums/RacerStatus";
import { RaceStatus } from "../../../enums/RaceStatus";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";
import { setStreakText } from "../../mandatory/streakText";
import { onSeason } from "../../speedrun/speedrun";
import {
  getFastClearNumAliveBosses,
  getFastClearNumAliveEnemies,
} from "../major/fastClear/v";

const SPLITTING_BOSS_ENTITY_TYPE_SET = new ReadonlySet<EntityType>([
  EntityType.FISTULA_BIG, // 71
  EntityType.FISTULA_MEDIUM, // 72
  EntityType.FISTULA_SMALL, // 73
  EntityType.BLASTOCYST_BIG, // 74
  EntityType.BLASTOCYST_MEDIUM, // 75
  EntityType.BLASTOCYST_SMALL, // 76
  EntityType.FALLEN, // 81
  EntityType.BROWNIE, // 402
]);

const BOSS_POSITIONS = [
  gridCoordinatesToWorldPosition(7, 6), // Left of the items
  gridCoordinatesToWorldPosition(18, 7), // Right of the items
  gridCoordinatesToWorldPosition(12, 2), // Above the items
  /// gridCoordinatesToWorldPosition(13, 11), // Below the items (currently unused)
] as const;

/**
 * Krampus, Uriel, and Gabriel are not included in the boss set from the standard library, so we do
 * not have to exclude them. (We want to exclude them since they will drop items.)
 */
const BOSS_RUSH_EXCLUSIONS = [
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

  // Clog's spin attack is unfair with other bosses on the screen.
  `${EntityType.CLOG}.0`, // 914.0

  // Colostomia spin attack is not fair with other bosses on the screen at the same time.
  `${EntityType.COLOSTOMIA}.0`, // 917.0
] as const;

const BOSS_RUSH_BOSSES: readonly string[] = (() => {
  const bossSet = copySet(getAllBossesSet(false));

  for (const entityTypeVariantString of BOSS_RUSH_EXCLUSIONS) {
    bossSet.delete(entityTypeVariantString);
  }

  return [...bossSet.values()];
})();

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
    inProgress: false,
    finished: false,

    /**
     * An array of entity type + variant strings, matching the format of the boss set from the
     * standard library.
     */
    selectedBosses: [] as string[],
  },

  /**
   * In vanilla, saving and quitting in the middle of the Boss Rush will reset the wave back to 0.
   */
  room: {
    currentWave: 0,
    spawnWaveGameFrame: 0,
  },
};

export function init(): void {
  mod.saveDataManager("fastBossRush", v);
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.FastBossRush) {
    return;
  }

  const room = game.GetRoom();
  const roomType = room.GetType();
  if (roomType !== RoomType.BOSS_RUSH) {
    return;
  }

  checkSpawnNextWave();
}

function checkSpawnNextWave() {
  if (!v.run.inProgress) {
    return;
  }

  // Don't do anything if we are in the short delay between waves.
  const gameFrameCount = game.GetFrameCount();
  if (v.room.spawnWaveGameFrame !== 0) {
    if (gameFrameCount >= v.room.spawnWaveGameFrame) {
      v.room.spawnWaveGameFrame = 0;
      spawnNextWave();
    }

    return;
  }

  const totalBossesDefeatedIfWaveIsClear =
    v.room.currentWave * NUM_BOSSES_PER_WAVE;

  if (!isWaveComplete(totalBossesDefeatedIfWaveIsClear)) {
    return;
  }

  log(
    `Boss Rush wave ${v.room.currentWave} completed. Total bosses defeated so far: ${totalBossesDefeatedIfWaveIsClear}`,
  );

  if (v.room.currentWave > 0) {
    addRoomClearCharges();
  }

  // Find out if the Boss Rush is over.
  if (totalBossesDefeatedIfWaveIsClear >= NUM_TOTAL_BOSSES) {
    finish();
  } else {
    // Spawn the next wave after a short delay.
    v.room.spawnWaveGameFrame = gameFrameCount + NUM_GAME_FRAMES_BETWEEN_WAVES;
    v.room.currentWave++;
  }
}

function spawnNextWave() {
  const gameFrameCount = game.GetFrameCount();

  for (let i = 0; i < NUM_BOSSES_PER_WAVE; i++) {
    // Get the boss to spawn.
    const bossIndex =
      v.room.currentWave * NUM_BOSSES_PER_WAVE - NUM_BOSSES_PER_WAVE + i;
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

      // Clutch is deliberately not spawned with 3 Clickety Clacks since they can wander far away in
      // a 2x2 room and cause a frustrating search.
    });
  }

  sfxManager.Play(SoundEffect.SUMMON_SOUND);

  // Display the wave number as streak text.
  const totalWaves = math.floor(NUM_TOTAL_BOSSES / NUM_BOSSES_PER_WAVE);
  setStreakText(`Wave ${v.room.currentWave} / ${totalWaves}`);

  log(
    `Spawned Boss Rush wave ${v.room.currentWave} on game frame: ${gameFrameCount}`,
  );
}

function getNumBossSegments(entityType: EntityType): int {
  switch (entityType) {
    // 19
    case EntityType.LARRY_JR: {
      return 10;
    }

    // 28
    case EntityType.CHUB: {
      return 3;
    }

    // 237
    case EntityType.GURGLING: {
      // Gurglings and Turdlings spawn in sets of 3. (This is how it is in the vanilla Boss Rush.)
      return 3;
    }

    // 918
    case EntityType.TURDLET: {
      // Turdlet functions slightly differently from Larry Jr. Instead of splitting when an segment
      // entity dies, HP is shared between segments and he splits into two halves. Thus, having a
      // Turdlet with more than 5 segments would cause more than 1 split. For this reason, we use
      // the vanilla value of 5 instead of matching the value for Larry Jr.
      return 5;
    }

    default: {
      return 1;
    }
  }
}

function getBossSpawnPosition(bossNum: int): Vector {
  const room = game.GetRoom();

  const basePosition = BOSS_POSITIONS[bossNum];
  if (basePosition === undefined) {
    error(`Failed to get the base boss position for boss number: ${bossNum}`);
  }

  for (let i = 0; i < 100; i++) {
    const position = room.FindFreePickupSpawnPosition(basePosition, i, true);

    const gridEntity = room.GetGridEntityFromPos(position);

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
  v.run.inProgress = false;
  v.run.finished = true;
  game.SetStateFlag(GameStateFlag.BOSS_RUSH_DONE, true);

  spawnBossRushFinishReward();
  openAllDoors();
  sfxManager.Play(SoundEffect.DOOR_HEAVY_OPEN);

  // Because of the emulated Boss Rush, the battle music will continue to play.
  musicManager.Crossfade(Music.BOSS_OVER);

  // Announce the completion via streak text.
  setStreakText("Complete!");
}

function spawnBossRushFinishReward() {
  const room = game.GetRoom();
  const roomSeed = room.GetSpawnSeed();
  const centerPos = room.GetCenterPos();

  const position = findFreePosition(centerPos, true);
  if (onSeason(3)) {
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

  mod.spawnCollectible(CollectibleType.NULL, position, roomSeed);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const room = game.GetRoom();
  const roomType = room.GetType();

  // In vanilla, saving and quitting in the middle of the Boss Rush will reset the wave back to 0.
  // However, teleporting out of the room before completing it will mark it as being completed.
  // Thus, we need to emulate this. Note that the player will still be able to restart the Boss Rush
  // if they go back in and touch another collectible. (This is also how vanilla works.)
  if (v.run.inProgress && !v.run.finished && roomType !== RoomType.BOSS_RUSH) {
    v.run.inProgress = false;
    v.run.finished = true;
    game.SetStateFlag(GameStateFlag.BOSS_RUSH_DONE, true);
  }
}

// ModCallbackCustom.POST_AMBUSH_STARTED
// AmbushType.BOSS_RUSH
export function postAmbushStartedBossRush(): void {
  if (!config.FastBossRush) {
    return;
  }

  startCustomBossRush();
}

function startCustomBossRush() {
  v.run.inProgress = true;
  v.room.currentWave = 0;
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
  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();
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
