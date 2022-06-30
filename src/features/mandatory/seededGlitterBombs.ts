import {
  CollectibleType,
  EntityType,
  PickupNullSubType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  getRandom,
  newRNG,
  saveDataManager,
  setSeed,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import { PickupVariantCustom } from "../../enums/PickupVariantCustom";
import g from "../../globals";

/** This chance is modified by 1% for every prize previously awarded on the floor. */
const GLITTER_BOMBS_PRIZE_BASE_CHANCE_PERCENT = 63;

const v = {
  run: {
    spawningPrize: false,
    rng: newRNG(),
  },

  level: {
    numPrizes: 0,
  },
};

export function init(): void {
  saveDataManager("seededGlitterBombs", v);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeed = g.seeds.GetStartSeed();
  setSeed(v.run.rng, startSeed);
}

// ModCallback.PRE_ENTITY_SPAWN (24)
// EntityType.PICKUP (5)
// PickupVariant.NULL (0)
export function preEntitySpawnPickupNull(
  subType: PickupNullSubType,
  spawner: Entity | undefined,
): [EntityType, int, int, int] | undefined {
  if (
    subType !== PickupNullSubType.EXCLUDE_COLLECTIBLES_CHESTS ||
    spawner === undefined ||
    spawner.Type !== EntityType.BOMB ||
    spawner.SpawnerEntity === undefined ||
    v.run.spawningPrize
  ) {
    return undefined;
  }

  const player = spawner.SpawnerEntity.ToPlayer();
  if (
    player === undefined ||
    !player.HasCollectible(CollectibleType.GLITTER_BOMBS)
  ) {
    return undefined;
  }

  return [EntityType.PICKUP, PickupVariantCustom.INVISIBLE_PICKUP, 0, 0];
}

// ModCallbackCustom.POST_BOMB_EXPLODED
export function postBombExploded(bomb: EntityBomb): void {
  if (bomb.SpawnerEntity === undefined) {
    return undefined;
  }

  const player = bomb.SpawnerEntity.ToPlayer();
  if (
    player === undefined ||
    !player.HasCollectible(CollectibleType.GLITTER_BOMBS)
  ) {
    return undefined;
  }

  if (shouldSpawnGlitterBombPrize()) {
    v.run.spawningPrize = true;
    const seed = v.run.rng.Next();
    spawnPickup(
      PickupVariant.NULL,
      PickupNullSubType.EXCLUDE_COLLECTIBLES_CHESTS,
      bomb.Position,
      VectorZero,
      bomb,
      seed,
    );
    v.run.spawningPrize = false;
    v.level.numPrizes += 1;
  }
}

/** See: https://bindingofisaacrebirth.fandom.com/wiki/Glitter_Bombs */
function shouldSpawnGlitterBombPrize() {
  const prizeThreshold =
    (GLITTER_BOMBS_PRIZE_BASE_CHANCE_PERCENT - v.level.numPrizes) / 100;
  const chance = getRandom(v.run.rng);
  return chance < prizeThreshold;
}
