import {
  AngelVariant,
  CollectibleType,
  EntityType,
  PickupVariant,
} from "isaac-typescript-definitions";
import * as replacePhotos from "../features/mandatory/replacePhotos";
import * as consistentAngels from "../features/optional/bosses/consistentAngels";
import * as replaceCodWorms from "../features/optional/enemies/replaceCodWorms";

export const preEntitySpawnFunctions = new Map<
  EntityType,
  (
    variant: int,
    subType: int,
    position: Vector,
    spawner: Entity | undefined,
    initSeed: int,
  ) => [EntityType, int, int, int] | void
>();

// 5
preEntitySpawnFunctions.set(
  EntityType.PICKUP,
  (
    variant: PickupVariant,
    subType: int,
    _position: Vector,
    _spawner: Entity | undefined,
    _initSeed: int,
  ) => {
    if (variant === PickupVariant.COLLECTIBLE) {
      return replacePhotos.preEntitySpawnCollectible(
        subType as CollectibleType,
      );
    }

    return undefined;
  },
);

// 221
preEntitySpawnFunctions.set(
  EntityType.COD_WORM,
  (
    _variant: int,
    _subType: int,
    _position: Vector,
    _spawner: Entity | undefined,
    initSeed: int,
  ) => replaceCodWorms.preEntitySpawnCodWorm(initSeed),
);

// 271
preEntitySpawnFunctions.set(
  EntityType.URIEL,
  (
    variant: int,
    subType: int,
    _position: Vector,
    _spawner: Entity | undefined,
    initSeed: int,
  ) =>
    consistentAngels.preEntitySpawnUriel(
      variant as AngelVariant,
      subType,
      initSeed,
    ),
);

// 272
preEntitySpawnFunctions.set(
  EntityType.GABRIEL,
  (
    variant: int,
    subType: int,
    _position: Vector,
    _spawner: Entity | undefined,
    initSeed: int,
  ) =>
    consistentAngels.preEntitySpawnGabriel(
      variant as AngelVariant,
      subType,
      initSeed,
    ),
);
