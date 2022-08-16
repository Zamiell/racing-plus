import {
  EntityFlag,
  EntityType,
  MamaGurdyVariant,
  PinVariant,
} from "isaac-typescript-definitions";
import {
  copySet,
  getAllBossesSet,
  getRandomArrayElement,
  newRNG,
  repeat,
  saveDataManager,
  spawnNPC,
  VectorZero,
} from "isaacscript-common";
import { EntityTypeCustom } from "../../../enums/EntityTypeCustom";
import g from "../../../globals";

// TODO: Turdlet code
// TODO: Clutch code (need to spawn 3x Clickety Clack)

/**
 * Krampus, Uriel, and Gabriel are not included in the boss set from the standard library, so we do
 * not have to exclude them. (We want to exclude them since they will drop items.)
 */
const BOSS_RUSH_EXCLUSIONS: readonly string[] = [
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
const TOTAL_BOSSES = 30;

const NUM_GAME_FRAMES_BETWEEN_WAVES = 20;

const v = {
  run: {
    started: false,
    finished: false,
    currentWave: 0,

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
  // TODO
}

// ModCallbackCustom.POST_AMBUSH_STARTED
// AmbushType.BOSS_RUSH
export function postAmbushStartedBossRush(): void {
  start();
}

function start() {
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

  repeat(TOTAL_BOSSES, () => {
    const randomBoss = getRandomArrayElement(
      BOSS_RUSH_BOSSES,
      rng,
      randomBosses,
    );
    randomBosses.push(randomBoss);
  });

  return randomBosses;
}
