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
  spawnCollectibleUnsafe,
} from "isaacscript-common";
import { PickupVariantCustom } from "../../../../enums/PickupVariantCustom";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { inRace } from "../../../../features/race/v";
import { g } from "../../../../globals";
import { mod } from "../../../../mod";
import { inSpeedrun } from "../../../../speedrun/utilsSpeedrun";
import {
  getPlayerPhotoStatus,
  inClearedMomBossRoom,
  inMomBossRoom,
} from "../../../../utils";
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

/**
 * Racing+ spawns the photos after the Mom fight manually so that they work properly with
 * fast-clear, multi-character speedruns, and other special situations.
 */
export class ReplacePhotos extends MandatoryModFeature {
  /**
   * We need to prevent the vanilla Polaroid and Negative from spawning because Racing+ spawns those
   * manually to speed up the Mom fight.
   *
   * We differentiate between a vanilla photo and a custom photo by the spawner; Racing+ will always
   * use the player as the spawner for custom photos.
   */
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
    spawner: Entity | undefined,
    _initSeed: int,
  ): [EntityType, int, int, int] | undefined {
    if (this.isVanillaPhotoAfterMom(subType, spawner)) {
      return [EntityType.PICKUP, PickupVariantCustom.INVISIBLE_PICKUP, 0, 0];
    }

    return undefined;
  }

  isVanillaPhotoAfterMom(subType: int, spawner: Entity | undefined): boolean {
    const collectibleType = asCollectibleType(subType);
    return (
      (collectibleType === CollectibleType.POLAROID ||
        collectibleType === CollectibleType.NEGATIVE) &&
      spawner === undefined &&
      inMomBossRoom()
    );
  }
}

export function replacePhotosPostFastClear(): void {
  if (inClearedMomBossRoom()) {
    manuallySpawnPhotos();
  }
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
  const player = Isaac.GetPlayer();

  switch (situation) {
    case PhotoSituation.POLAROID: {
      mod.spawnCollectible(
        CollectibleType.POLAROID,
        PEDESTAL_POSITION_CENTER,
        rng,
        true,
        false,
        player,
      );

      break;
    }

    case PhotoSituation.NEGATIVE: {
      mod.spawnCollectible(
        CollectibleType.NEGATIVE,
        PEDESTAL_POSITION_CENTER,
        rng,
        true,
        false,
        player,
      );

      break;
    }

    case PhotoSituation.BOTH: {
      mod.spawnCollectible(
        CollectibleType.POLAROID,
        PEDESTAL_POSITION_LEFT,
        rng,
        true,
        false,
        player,
      );

      mod.spawnCollectible(
        CollectibleType.NEGATIVE,
        PEDESTAL_POSITION_RIGHT,
        rng,
        true,
        false,
        player,
      );

      break;
    }

    case PhotoSituation.RANDOM_BOSS_ITEM: {
      // If we spawn a boss item using an `InitSeed` of 0, the item will always be the same, so use
      // the room seed instead.
      if (anyPlayerHasCollectible(CollectibleType.THERES_OPTIONS)) {
        // If the player has There's Options, they should get two boss items instead of 1.
        spawnCollectibleUnsafe(
          CollectibleType.NULL,
          PEDESTAL_POSITION_LEFT,
          rng,
          true,
        );

        spawnCollectibleUnsafe(
          CollectibleType.NULL,
          PEDESTAL_POSITION_RIGHT,
          rng,
          true,
        );
      } else {
        spawnCollectibleUnsafe(
          CollectibleType.NULL,
          PEDESTAL_POSITION_CENTER,
          rng,
        );
      }

      break;
    }
  }
}
