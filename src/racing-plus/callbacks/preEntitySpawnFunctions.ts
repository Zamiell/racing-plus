import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as replaceCodWorms from "../features/optional/enemies/replaceCodWorms";

const functionMap = new Map<
  EntityType,
  (
    variant: int,
    subType: int,
    position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => [EntityType, int, int, int] | void
>();
export default functionMap;

// 5
functionMap.set(
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
functionMap.set(
  EntityType.ENTITY_COD_WORM,
  (
    _variant: int,
    _subType: int,
    _position: Vector,
    _spawner: Entity,
    initSeed: int,
  ) => {
    return replaceCodWorms.preEntitySpawn(initSeed);
  },
);
