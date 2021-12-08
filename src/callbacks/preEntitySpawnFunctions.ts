import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as replaceCodWorms from "../features/optional/enemies/replaceCodWorms";

export const preEntitySpawnFunctions = new Map<
  EntityType,
  (
    variant: int,
    subType: int,
    position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => [EntityType, int, int, int] | void
>();

// 5
preEntitySpawnFunctions.set(
  EntityType.ENTITY_PICKUP,
  (
    variant: int,
    subType: int,
    _position: Vector,
    _spawner: Entity,
    _initSeed: int,
  ) => {
    if (variant === PickupVariant.PICKUP_COLLECTIBLE) {
      return replacePhotos.preEntitySpawnCollectible(subType);
    }

    return undefined;
  },
);

// 221
preEntitySpawnFunctions.set(
  EntityType.ENTITY_COD_WORM,
  (
    _variant: int,
    _subType: int,
    _position: Vector,
    _spawner: Entity,
    initSeed: int,
  ) => replaceCodWorms.preEntitySpawn(initSeed),
);
