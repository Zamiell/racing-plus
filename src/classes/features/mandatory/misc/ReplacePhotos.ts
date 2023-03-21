import {
  CollectibleType,
  EntityType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
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
import { getPhotoStatus } from "../../../../utils";
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
  room: {
    manuallySpawnedPhotos: false,
    vanillaPhotosLeftToSpawn: 0,
  },
};

export class ReplacePhotos extends MandatoryModFeature {
  v = v;

  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.MOM)
  postEntityKillMom(): void {
    if (v.room.manuallySpawnedPhotos) {
      return;
    }

    v.room.manuallySpawnedPhotos = true;
    this.manuallySpawnPhotos();

    // Mark to delete two vanilla photos when they spawn a few frames from now.
    v.room.vanillaPhotosLeftToSpawn = 2;
  }

  manuallySpawnPhotos(): void {
    const situation = this.getPhotoSituation();
    this.doPhotoSituation(situation);
  }

  /** Figure out if we need to spawn The Polaroid, The Negative, or both. */
  getPhotoSituation(): PhotoSituation {
    // By default, custom speedrun challenges award both photos.
    if (inSpeedrun()) {
      return PhotoSituation.BOTH;
    }

    const { hasPolaroid, hasNegative } = getPhotoStatus();

    if (hasPolaroid && hasNegative) {
      // The player has both photos already (which can only occur in a diversity race). Spawn a
      // random boss item instead of a photo.
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
      return this.getPhotoSituationRace(g.race.goal);
    }

    // This is a normal run, so spawn both photos by default.
    return PhotoSituation.BOTH;
  }

  getPhotoSituationRace(goal: RaceGoal): PhotoSituation {
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

  doPhotoSituation(situation: PhotoSituation): void {
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
        // If we spawn a boss item using an `InitSeed` of 0, the item will always be the same, so
        // use the room seed instead.
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
