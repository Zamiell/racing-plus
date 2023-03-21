import {
  CollectibleType,
  EntityType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  anyPlayerHasCollectible,
  asCollectibleType,
  game,
  newRNG,
} from "isaacscript-common";
import { PickupVariantCustom } from "../../../../enums/PickupVariantCustom";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { inRace } from "../../../../features/race/v";
import { g } from "../../../../globals";
import { mod } from "../../../../mod";
import { inSpeedrun } from "../../../../speedrun/utilsSpeedrun";
import { getPlayerPhotoStatus, inClearedMomBossRoom } from "../../../../utils";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

enum PhotoSituation {
  POLAROID,
  NEGATIVE,
  BOTH,
  RANDOM_BOSS_ITEM,
}

const PEDESTAL_POSITION_CENTER = Vector(320, 360);
const PEDESTAL_POSITION_LEFT = Vector(280, 360);
const PEDESTAL_POSITION_RIGHT = Vector(360, 360);

const v = {
  level: {
    manuallySpawnedPhotos: false,
  },

  room: {
    vanillaPhotosLeftToSpawn: 0,
  },
};

/**
 * Racing+ spawns the photos after the Mom fight manually so that they work properly with
 * fast-clear, multi-character speedruns, and other special situations.
 */
export class ReplacePhotos extends MandatoryModFeature {
  v = v;

  @CallbackCustom(
    ModCallbackCustom.PRE_ENTITY_SPAWN_FILTER,
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
  )
  preEntitySpawnCollectible(
    _entityType: EntityType,
    _variant: int,
    subType: int,
    _position: Vector,
    _velocity: Vector,
    _spawner: Entity | undefined,
    _initSeed: int,
  ): [EntityType, int, int, int] | undefined {
    const collectibleType = asCollectibleType(subType);
    return this.preventVanillaPhotos(collectibleType);
  }

  /**
   * We need to prevent the vanilla Polaroid and Negative from spawning because Racing+ spawns those
   * manually to speed up the Mom fight.
   */
  preventVanillaPhotos(
    collectibleType: CollectibleType,
  ): [EntityType, int, int, int] | undefined {
    if (
      v.room.vanillaPhotosLeftToSpawn > 0 &&
      (collectibleType === CollectibleType.POLAROID ||
        collectibleType === CollectibleType.NEGATIVE)
    ) {
      v.room.vanillaPhotosLeftToSpawn--;

      return [EntityType.PICKUP, PickupVariantCustom.INVISIBLE_PICKUP, 0, 0];
    }

    return undefined;
  }
}

export function replacePhotosPreFastClear(): void {
  // The two vanilla photos will spawn when the fast-clear feature executes the `Room.TriggerClear`
  // method. Mark to delete them as soon as they spawn.
  v.room.vanillaPhotosLeftToSpawn = 2;
}

export function replacePhotosPostFastClear(): void {
  if (!inClearedMomBossRoom()) {
    return;
  }

  if (v.level.manuallySpawnedPhotos) {
    return;
  }

  v.level.manuallySpawnedPhotos = true;
  manuallySpawnPhotos();
}

function manuallySpawnPhotos() {
  const situation = getPhotoSituation();
  doPhotoSituation(situation);
}

/** Figure out if we need to spawn The Polaroid, The Negative, or both. */
function getPhotoSituation(): PhotoSituation {
  // By default, custom speedrun challenges award both photos.
  if (inSpeedrun()) {
    return PhotoSituation.BOTH;
  }

  const { hasPolaroid, hasNegative } = getPlayerPhotoStatus();

  if (hasPolaroid && hasNegative) {
    // The player has both photos already (which can only occur in a diversity race). Spawn a random
    // boss item instead of a photo.
    return PhotoSituation.RANDOM_BOSS_ITEM;
  }

  if (hasPolaroid) {
    // The player has The Polaroid already (which can occur if the player is Eden or is in a
    // diversity race). Spawn The Negative instead.
    return PhotoSituation.NEGATIVE;
  }

  if (hasNegative) {
    // The player has The Negative already (which can occur if the player is Eden or is in a
    // diversity race). Spawn The Polaroid instead.
    return PhotoSituation.POLAROID;
  }

  if (inRace()) {
    return getPhotoSituationRace(g.race.goal);
  }

  // This is a normal run, so spawn both photos by default.
  return PhotoSituation.BOTH;
}

function getPhotoSituationRace(goal: RaceGoal): PhotoSituation {
  switch (goal) {
    case RaceGoal.BLUE_BABY: {
      return PhotoSituation.POLAROID;
    }

    case RaceGoal.THE_LAMB: {
      return PhotoSituation.NEGATIVE;
    }

    case RaceGoal.MEGA_SATAN:
    case RaceGoal.HUSH:
    case RaceGoal.DELIRIUM:
    case RaceGoal.BOSS_RUSH:
    case RaceGoal.MOTHER:
    case RaceGoal.THE_BEAST:
    case RaceGoal.CUSTOM: {
      // Give the player a choice between the photos for races to alternate objectives.
      return PhotoSituation.BOTH;
    }
  }
}

function doPhotoSituation(situation: PhotoSituation) {
  const room = game.GetRoom();
  const roomSeed = room.GetSpawnSeed();
  const rng = newRNG(roomSeed);

  switch (situation) {
    case PhotoSituation.POLAROID: {
      mod.spawnCollectible(
        CollectibleType.POLAROID,
        PEDESTAL_POSITION_CENTER,
        rng,
      );

      break;
    }

    case PhotoSituation.NEGATIVE: {
      mod.spawnCollectible(
        CollectibleType.NEGATIVE,
        PEDESTAL_POSITION_CENTER,
        rng,
      );

      break;
    }

    case PhotoSituation.BOTH: {
      mod.spawnCollectible(
        CollectibleType.POLAROID,
        PEDESTAL_POSITION_LEFT,
        rng,
        true,
      );

      mod.spawnCollectible(
        CollectibleType.NEGATIVE,
        PEDESTAL_POSITION_RIGHT,
        rng,
        true,
      );

      break;
    }

    case PhotoSituation.RANDOM_BOSS_ITEM: {
      // If we spawn a boss item using an `InitSeed` of 0, the item will always be the same, so use
      // the room seed instead.
      if (anyPlayerHasCollectible(CollectibleType.THERES_OPTIONS)) {
        // If the player has There's Options, they should get two boss items instead of 1.
        mod.spawnCollectible(
          CollectibleType.NULL,
          PEDESTAL_POSITION_LEFT,
          rng,
          true,
        );

        mod.spawnCollectible(
          CollectibleType.NULL,
          PEDESTAL_POSITION_RIGHT,
          rng,
          true,
        );
      } else {
        mod.spawnCollectible(
          CollectibleType.NULL,
          PEDESTAL_POSITION_CENTER,
          rng,
        );
      }

      break;
    }
  }
}
