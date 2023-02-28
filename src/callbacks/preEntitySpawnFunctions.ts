import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as seededGlitterBombs from "../features/mandatory/seededGlitterBombs";

export const preEntitySpawnFunctions = new Map<
  EntityType,
  (
    variant: int,
    subType: int,
    position: Vector,
    velocity: Vector,
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
    position: Vector,
    velocity: Vector,
    spawner: Entity | undefined,
    initSeed: int,
  ) => {
    if (variant === PickupVariant.NULL) {
      return seededGlitterBombs.preEntitySpawnPickupNull(
        EntityType.PICKUP,
        variant,
        subType,
        position,
        velocity,
        spawner,
        initSeed,
      );
    }

    if (variant === PickupVariant.COLLECTIBLE) {
      return replacePhotos.preEntitySpawnCollectible(
        EntityType.PICKUP,
        variant,
        subType,
        position,
        velocity,
        spawner,
        initSeed,
      );
    }

    return undefined;
  },
);
