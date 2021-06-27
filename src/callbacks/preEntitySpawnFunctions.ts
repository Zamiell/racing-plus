import * as replaceCodWorms from "../features/optional/enemies/replaceCodWorms";

const functionMap = new Map<
  EntityType,
  (
    variant: EntityVariantForAC,
    subType: int,
    position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => [EntityType, int, int, int] | void
>();
export default functionMap;

// 221
functionMap.set(
  EntityType.ENTITY_COD_WORM,
  (
    _variant: EntityVariantForAC,
    _subType: int,
    _position: Vector,
    _spawner: Entity,
    initSeed: int,
  ) => {
    return replaceCodWorms.preEntitySpawn(initSeed);
  },
);
