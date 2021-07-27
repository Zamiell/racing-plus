import g from "../../globals";
import log from "../../log";
import {
  anyPlayerHasCollectible,
  ensureAllCases,
  hasPolaroidOrNegative,
  incrementRNG,
} from "../../misc";
import { PickupVariantCustom } from "../../types/enums";
import { RaceGoal } from "../race/types/RaceData";
import { ChallengeCustom } from "../speedrun/enums";

enum PhotoSituation {
  Polaroid,
  Negative,
  Both,
  RandomBossItem,
}

const PEDESTAL_POSITION_CENTER = Vector(320, 360);
const PEDESTAL_POSITION_LEFT = Vector(280, 360);
const PEDESTAL_POSITION_RIGHT = Vector(360, 360);

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
    g.run.room.vanillaPhotosLeftToSpawn > 0 &&
    (subType === CollectibleType.COLLECTIBLE_POLAROID ||
      subType === CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    g.run.room.vanillaPhotosLeftToSpawn -= 1;

    const photoName =
      subType === CollectibleType.COLLECTIBLE_POLAROID
        ? "Polaroid"
        : "Negative";
    const text = `Preventing a vanilla ${photoName} from spawning.`;
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
  if (!g.run.room.manuallySpawnedPhotos) {
    g.run.room.manuallySpawnedPhotos = true;
    manuallySpawn();

    // Mark to delete two vanilla photos when they spawn a few frames from now
    g.run.room.vanillaPhotosLeftToSpawn = 2;
  }
}

export function manuallySpawn(): void {
  const situation = getPhotoSituation();
  doPhotoSituation(situation);
}

// Figure out if we need to spawn The Polaroid, The Negative, or both
function getPhotoSituation() {
  const challenge = Isaac.GetChallenge();

  // Speedrun seasons have set goals
  if (challenge === ChallengeCustom.SEASON_1) {
    return PhotoSituation.Polaroid;
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
      return PhotoSituation.RandomBossItem;
    }
  }
}

function doPhotoSituation(situation: PhotoSituation) {
  const roomSeed = g.r.GetSpawnSeed();

  switch (situation) {
    case PhotoSituation.Polaroid: {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        PEDESTAL_POSITION_CENTER,
        Vector.Zero,
        null,
        CollectibleType.COLLECTIBLE_POLAROID,
        roomSeed,
      );
      break;
    }

    case PhotoSituation.Negative: {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        PEDESTAL_POSITION_CENTER,
        Vector.Zero,
        null,
        CollectibleType.COLLECTIBLE_NEGATIVE,
        roomSeed,
      );
      break;
    }

    case PhotoSituation.Both: {
      const polaroid = g.g
        .Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          PEDESTAL_POSITION_LEFT,
          Vector.Zero,
          null,
          CollectibleType.COLLECTIBLE_POLAROID,
          roomSeed,
        )
        .ToPickup();
      if (polaroid !== null) {
        polaroid.OptionsPickupIndex = 1;
      }

      // We don't want both of the collectibles to have the same RNG
      const newSeed = incrementRNG(roomSeed);

      const negative = g.g
        .Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          PEDESTAL_POSITION_RIGHT,
          Vector.Zero,
          null,
          CollectibleType.COLLECTIBLE_NEGATIVE,
          newSeed,
        )
        .ToPickup();
      if (negative !== null) {
        negative.OptionsPickupIndex = 1;
      }

      break;
    }

    case PhotoSituation.RandomBossItem: {
      // If we spawn a boss item using an InitSeed of 0, the item will always be Magic Mushroom,
      // so use the room seed instead
      // Spawning an item with a SubType of 0 will make a random item of the pool according to the
      // room type
      if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_THERES_OPTIONS)) {
        // If the player has There's Options, they should get two boss items instead of 1
        const item1 = g.g
          .Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COLLECTIBLE,
            PEDESTAL_POSITION_LEFT,
            Vector.Zero,
            null,
            0,
            roomSeed,
          )
          .ToPickup();
        if (item1 !== null) {
          item1.OptionsPickupIndex = 1;
        }

        // We don't want both of the collectibles to have the same RNG
        const newSeed = incrementRNG(roomSeed);

        const item2 = g.g
          .Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COLLECTIBLE,
            PEDESTAL_POSITION_RIGHT,
            Vector.Zero,
            null,
            0,
            newSeed,
          )
          .ToPickup();
        if (item2 !== null) {
          item2.OptionsPickupIndex = 1;
        }
      } else {
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          PEDESTAL_POSITION_CENTER,
          Vector.Zero,
          null,
          0,
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
