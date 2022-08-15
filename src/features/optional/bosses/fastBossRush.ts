import {
  EntityFlag,
  EntityType,
  MamaGurdyVariant,
  PinVariant,
} from "isaac-typescript-definitions";
import {
  copySet,
  getAllBossesSet,
  saveDataManager,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../enums/EffectVariantCustom";

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
  `${EntityType.GIDEON}.0`, // 907.0
];

const BOSS_RUSH_BOSS_SET = getBossRushBossSet();

function getBossRushBossSet(): ReadonlySet<string> {
  const bossSet = copySet(getAllBossesSet(false));

  for (const entityTypeVariantString of BOSS_RUSH_EXCLUSIONS) {
    bossSet.delete(entityTypeVariantString);
  }

  return bossSet;
}

/** In vanilla, it spawns 2 bosses at a time for 15 waves. */
const TOTAL_BOSSES = 30;

const NUM_GAME_FRAMES_BETWEEN_WAVES = 20;

const v = {
  run: {
    started: false,
    finished: false,
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
  // We need to prevent the vanilla Boss Rush from starting, so spawn a room clear delay effect as a
  // helper to keep the doors closed. (Otherwise, the doors will re-open on every frame.)
  const roomClearDelayEffect = spawnEffect(
    EffectVariantCustom.ROOM_CLEAR_DELAY,
    0,
    VectorZero,
  );
  roomClearDelayEffect.ClearEntityFlags(EntityFlag.APPEAR);
}
