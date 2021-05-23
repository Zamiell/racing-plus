import * as fastClearPreEntitySpawnCollectible from "../features/optional/major/fastClear/callbacks/preEntitySpawnCollectible";

const functionMap = new Map<
  PickupVariant,
  (
    subType: int,
    position: Vector,
    spawner: Entity,
    initSeed: int,
  ) => [EntityType, int, int, int] | null
>();
export default functionMap;

// 100
functionMap.set(
  PickupVariant.PICKUP_COLLECTIBLE,
  (subType: int, _position: Vector, _spawner: Entity, _initSeed: int) => {
    const returnTable = fastClearPreEntitySpawnCollectible.main(subType);
    if (returnTable !== null) {
      return returnTable;
    }

    return null;
  },
);
