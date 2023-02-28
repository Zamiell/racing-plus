import { EntityType, PickupVariant } from "isaac-typescript-definitions";
import * as replacePhotos from "../features/mandatory/replacePhotos";

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
