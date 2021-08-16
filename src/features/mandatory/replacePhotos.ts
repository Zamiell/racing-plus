import {
  anyPlayerHasCollectible,
  ensureAllCases,
  log,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { PickupVariantCustom } from "../../types/enums";
import { hasPolaroidOrNegative, incrementRNG } from "../../util";
import { spawnCollectible } from "../../utilGlobals";
import { RaceGoal } from "../race/types/RaceData";
import { inSpeedrun } from "../speedrun/speedrun";

enum PhotoSituation {
  Polaroid,
  Negative,
  Both,
  RandomBossItem,
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

function manuallySpawn(): void {
  const situation = getPhotoSituation();
  doPhotoSituation(situation);
}

// Figure out if we need to spawn The Polaroid, The Negative, or both
function getPhotoSituation() {
  // By default, custom speedrun challenges award both photos
  if (inSpeedrun()) {
    return PhotoSituation.Both;
  }

  const [hasPolaroid, hasNegative] = hasPolaroidOrNegative();

  if (hasPolaroid && hasNegative) {
    // The player has both photos already (which can only occur in a diversity race)
    // Spawn a random boss item instead of a photo
    return PhotoSituation.RandomBossItem;
  }

  if (hasPolaroid) {
    // The player has The Polaroid already
    // (which can occur if the player is Eden or is in a diversity race)
    // Spawn The Negative instead
    return PhotoSituation.Negative;
  }

  if (hasNegative) {
    // The player has The Negative already
    // (which can occur if the player is Eden or is in a diversity race)
    // Spawn The Polaroid instead
    return PhotoSituation.Polaroid;
  }

  if (g.race.status === "in progress" && g.race.myStatus === "racing") {
    return getPhotoSituationRace(g.race.goal);
  }

  // This is a normal run, so spawn both photos by default
  return PhotoSituation.Both;
}

function getPhotoSituationRace(goal: RaceGoal) {
  switch (goal) {
    case "Blue Baby": {
      return PhotoSituation.Polaroid;
    }

    case "The Lamb": {
      return PhotoSituation.Negative;
    }

    case "Mega Satan":
    case "Hush":
    case "Delirium":
    case "Boss Rush":
    case "Mother":
    case "The Beast":
    case "custom": {
      // Give the player a choice between the photos for races to alternate objectives
      return PhotoSituation.Both;
    }

    default: {
      ensureAllCases(goal);
      return PhotoSituation.Both;
    }
  }
}

function doPhotoSituation(situation: PhotoSituation) {
  const roomSeed = g.r.GetSpawnSeed();

  switch (situation) {
    case PhotoSituation.Polaroid: {
      spawnCollectible(
        CollectibleType.COLLECTIBLE_POLAROID,
        PEDESTAL_POSITION_CENTER,
        roomSeed,
        false,
      );
      break;
    }

    case PhotoSituation.Negative: {
      spawnCollectible(
        CollectibleType.COLLECTIBLE_NEGATIVE,
        PEDESTAL_POSITION_CENTER,
        roomSeed,
        false,
      );
      break;
    }

    case PhotoSituation.Both: {
      spawnCollectible(
        CollectibleType.COLLECTIBLE_POLAROID,
        PEDESTAL_POSITION_LEFT,
        roomSeed,
        true,
      );

      // We don't want both of the collectibles to have the same RNG
      const newSeed = incrementRNG(roomSeed);

      spawnCollectible(
        CollectibleType.COLLECTIBLE_NEGATIVE,
        PEDESTAL_POSITION_RIGHT,
        newSeed,
        true,
      );

      break;
    }

    case PhotoSituation.RandomBossItem: {
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
        const newSeed = incrementRNG(roomSeed);

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
          false,
        );
      }

      break;
    }

    default: {
      ensureAllCases(situation);
    }
  }
}
