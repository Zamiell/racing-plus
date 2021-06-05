import * as replaceCodWorms from "../features/optional/enemies/replaceCodWorms";
import preEntitySpawnPickupFunctions from "./preEntitySpawnPickupFunctions";

const functionMap = new Map<
  EntityType,
  (
    variant: EntityVariantForAC,
    subType: int,
    position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => [EntityType, int, int, int] | null
>();
export default functionMap;

// 5
functionMap.set(
  EntityType.ENTITY_PICKUP,
  (
    variant: EntityVariantForAC,
    subType: int,
    position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => {
    const preEntitySpawnPickupFunction =
      preEntitySpawnPickupFunctions.get(variant);
    if (preEntitySpawnPickupFunction !== undefined) {
      return preEntitySpawnPickupFunction(subType, position, spawner, initSeed);
    }

    return null;
  },
);

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
    const returnValue = replaceCodWorms.preEntitySpawn(initSeed);
    if (returnValue !== null) {
      return returnValue;
    }

    return null;
  },
);
