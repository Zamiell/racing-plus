import {
  CollectibleType,
  EntityType,
  PickupNullSubType,
  PickupVariant,
} from "isaac-typescript-definitions";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as seededGlitterBombs from "../features/mandatory/seededGlitterBombs";

export const preEntitySpawnFunctions = new Map<
  EntityType,
  (
    variant: int,
    subType: int,
    position: Vector,
    spawner: Entity | undefined,
    initSeed: int,
  ) => [EntityType, int, int, int] | undefined
>();

// 5
preEntitySpawnFunctions.set(
  EntityType.PICKUP,
  (
    variant: PickupVariant,
    subType: int,
    _position: Vector,
    spawner: Entity | undefined,
    _initSeed: int,
  ) => {
    if (variant === PickupVariant.NULL) {
      return seededGlitterBombs.preEntitySpawnPickupNull(
        subType as PickupNullSubType,
        spawner,
      );
    }

    if (variant === PickupVariant.COLLECTIBLE) {
      return replacePhotos.preEntitySpawnCollectible(
        subType as CollectibleType,
      );
    }

    return undefined;
  },
);
