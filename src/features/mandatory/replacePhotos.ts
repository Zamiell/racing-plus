import {
  anyPlayerHasCollectible,
  ensureAllCases,
  log,
  nextSeed,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { PickupVariantCustom } from "../../types/enums";
import { hasPolaroidOrNegative } from "../../util";
import { spawnCollectible } from "../../utilGlobals";
import { RaceGoal } from "../race/types/RaceGoal";
import { RacerStatus } from "../race/types/RacerStatus";
import { RaceStatus } from "../race/types/RaceStatus";
import { inSpeedrun } from "../speedrun/speedrun";

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

export function init(): void {
  saveDataManager("replacePhotos", v);
}

// ModCallbacks.MC_PRE_ENTITY_SPAWN (24)
export function preEntitySpawnCollectible(
  subType: int,
): [EntityType, int, int, int] | void {
  const returnArray = preventVanillaPhotos(subType);
  if (returnArray !== undefined) {
    return returnArray;
  }

  return undefined;
}

// We need to prevent the vanilla Polaroid and Negative from spawning because Racing+ spawns those
// manually to speed up the Mom fight
function preventVanillaPhotos(
  subType: int,
): [EntityType | int, int, int, int] | void {
  if (
    v.room.vanillaPhotosLeftToSpawn > 0 &&
    (subType === CollectibleType.COLLECTIBLE_POLAROID ||
      subType === CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    v.room.vanillaPhotosLeftToSpawn -= 1;

    const photoName =
      subType === CollectibleType.COLLECTIBLE_POLAROID
        ? "Polaroid"
        : "Negative";
    const gameFrameCount = g.g.GetFrameCount();
    const text = `Preventing a vanilla ${photoName} from spawning on game frame: ${gameFrameCount}`;
    log(text);

    return [
      EntityType.ENTITY_PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      0,
    ];
  }

  return undefined;
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKillMom(_entity: Entity): void {
  if (!v.room.manuallySpawnedPhotos) {
    v.room.manuallySpawnedPhotos = true;
    manuallySpawn();

    // Mark to delete two vanilla photos when they spawn a few frames from now
    v.room.vanillaPhotosLeftToSpawn = 2;
  }
}

function manuallySpawn() {
  const situation = getPhotoSituation();
  doPhotoSituation(situation);
}

// Figure out if we need to spawn The Polaroid, The Negative, or both
function getPhotoSituation() {
  // By default, custom speedrun challenges award both photos
  if (inSpeedrun()) {
    return PhotoSituation.BOTH;
  }

  const [hasPolaroid, hasNegative] = hasPolaroidOrNegative();

  if (hasPolaroid && hasNegative) {
    // The player has both photos already (which can only occur in a diversity race)
    // Spawn a random boss item instead of a photo
    return PhotoSituation.RANDOM_BOSS_ITEM;
  }

  if (hasPolaroid) {
    // The player has The Polaroid already
    // (which can occur if the player is Eden or is in a diversity race)
    // Spawn The Negative instead
    return PhotoSituation.NEGATIVE;
  }

  if (hasNegative) {
    // The player has The Negative already
    // (which can occur if the player is Eden or is in a diversity race)
    // Spawn The Polaroid instead
    return PhotoSituation.POLAROID;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    return getPhotoSituationRace(g.race.goal);
  }

  // This is a normal run, so spawn both photos by default
  return PhotoSituation.BOTH;
}

function getPhotoSituationRace(goal: RaceGoal) {
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
      // Give the player a choice between the photos for races to alternate objectives
      return PhotoSituation.BOTH;
    }

    default: {
      ensureAllCases(goal);
      return PhotoSituation.POLAROID;
    }
  }
}

function doPhotoSituation(situation: PhotoSituation) {
  const roomSeed = g.r.GetSpawnSeed();

  switch (situation) {
    case PhotoSituation.POLAROID: {
      spawnCollectible(
        CollectibleType.COLLECTIBLE_POLAROID,
        PEDESTAL_POSITION_CENTER,
        roomSeed,
      );
      break;
    }

    case PhotoSituation.NEGATIVE: {
      spawnCollectible(
        CollectibleType.COLLECTIBLE_NEGATIVE,
        PEDESTAL_POSITION_CENTER,
        roomSeed,
      );
      break;
    }

    case PhotoSituation.BOTH: {
      spawnCollectible(
        CollectibleType.COLLECTIBLE_POLAROID,
        PEDESTAL_POSITION_LEFT,
        roomSeed,
        true,
      );

      // We don't want both of the collectibles to have the same RNG
      const newSeed = nextSeed(roomSeed);

      spawnCollectible(
        CollectibleType.COLLECTIBLE_NEGATIVE,
        PEDESTAL_POSITION_RIGHT,
        newSeed,
        true,
      );

      break;
    }

    case PhotoSituation.RANDOM_BOSS_ITEM: {
      // If we spawn a boss item using an InitSeed of 0, the item will always be the same,
      // so use the room seed instead
      if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_THERES_OPTIONS)) {
        // If the player has There's Options, they should get two boss items instead of 1
        spawnCollectible(
          CollectibleType.COLLECTIBLE_NULL,
          PEDESTAL_POSITION_LEFT,
          roomSeed,
          true,
        );

        // We don't want both of the collectibles to have the same RNG
        const newSeed = nextSeed(roomSeed);

        spawnCollectible(
          CollectibleType.COLLECTIBLE_NULL,
          PEDESTAL_POSITION_RIGHT,
          newSeed,
          true,
        );
      } else {
        spawnCollectible(
          CollectibleType.COLLECTIBLE_NULL,
          PEDESTAL_POSITION_CENTER,
          roomSeed,
        );
      }

      break;
    }

    default: {
      ensureAllCases(situation);
    }
  }
}
