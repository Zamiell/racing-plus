import {
  CollectibleType,
  EntityType,
  PickupNullSubType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  game,
  getRandom,
  newRNG,
  setSeed,
  spawnPickup,
} from "isaacscript-common";
import { PickupVariantCustom } from "../../../../enums/PickupVariantCustom";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

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

export class SeededGlitterBombs extends MandatoryModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    if (bomb.SpawnerEntity === undefined) {
      return;
    }

    const player = bomb.SpawnerEntity.ToPlayer();
    if (
      player === undefined
      || !player.HasCollectible(CollectibleType.GLITTER_BOMBS)
    ) {
      return;
    }

    if (this.shouldSpawnGlitterBombPrize()) {
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
      v.level.numPrizes++;
    }
  }

  /** @see https://bindingofisaacrebirth.fandom.com/wiki/Glitter_Bombs */
  shouldSpawnGlitterBombPrize(): boolean {
    const prizeThreshold =
      (GLITTER_BOMBS_PRIZE_BASE_CHANCE_PERCENT - v.level.numPrizes) / 100;
    const chance = getRandom(v.run.rng);
    return chance < prizeThreshold;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    setSeed(v.run.rng, startSeed);
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.NULL,
    PickupNullSubType.EXCLUDE_COLLECTIBLES_CHESTS,
  )
  preEntitySpawnPickupNull(
    _entityType: EntityType,
    _variant: int,
    _subType: int,
    _position: Vector,
    _velocity: Vector,
    spawner: Entity | undefined,
    initSeed: Seed,
  ):
    | [entityType: EntityType, variant: int, subType: int, initSeed: Seed]
    | undefined {
    if (
      v.run.spawningPrize
      || spawner === undefined
      || spawner.Type !== EntityType.BOMB
      || spawner.SpawnerEntity === undefined
    ) {
      return undefined;
    }

    const player = spawner.SpawnerEntity.ToPlayer();
    if (
      player === undefined
      || !player.HasCollectible(CollectibleType.GLITTER_BOMBS)
    ) {
      return undefined;
    }

    return [
      EntityType.PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      initSeed,
    ];
  }
}
