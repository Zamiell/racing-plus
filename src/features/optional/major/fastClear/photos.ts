import g from "../../../../globals";
import { ensureAllCases, incrementRNG } from "../../../../misc";
import { RaceGoal } from "../../../../types/RaceData";
import { ChallengeCustom } from "../../../speedrun/enums";

enum PhotoSituation {
  POLAROID,
  NEGATIVE,
  BOTH,
  RANDOM_BOSS_ITEM,
}

const MOM_ROOM_VARIANTS = [1060, 1061, 1062, 1063, 1064];

export function spawn(): void {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  // Only spawn the photos after the boss of Depths 2
  if (stage === 6 && roomType === RoomType.ROOM_BOSS && isMomRoom()) {
    const situation = getPhotoSituation();
    doPhotoSituation(situation);
  }
}

function isMomRoom() {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomVariant = roomDesc.Data.Variant;
  return MOM_ROOM_VARIANTS.includes(roomVariant);
}

function getPhotoSituation() {
  const challenge = Isaac.GetChallenge();

  // Figure out if we need to spawn The Polaroid, The Negative, or both
  let hasPolaroid = g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID);
  let hasNegative = g.p.HasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE);
  if (g.p.HasTrinket(TrinketType.TRINKET_MYSTERIOUS_PAPER)) {
    // On every frame, the Mysterious Paper trinket will randomly give The Polaroid or The Negative
    // Since it is impossible to determine the player's actual photo status,
    // assume that they do not have either photo yet, which will almost always be the case
    // (unless they are Eden or this is a Diversity race where they started with one or more photos)
    hasPolaroid = false;
    hasNegative = false;
  }

  if (challenge === ChallengeCustom.R7_SEASON_1) {
    return PhotoSituation.POLAROID;
  }

  if (hasPolaroid && hasNegative) {
    // The player has both photos already (which can only occur in a diversity race)
    // Spawn a random boss item instead of a photo
    return PhotoSituation.RANDOM_BOSS_ITEM;
  }

  if (hasPolaroid) {
    // The player has The Polaroid already
    // (which can occur if Eden, or in a diversity race, or in Season 7)
    // Spawn The Negative instead
    return PhotoSituation.NEGATIVE;
  }

  if (hasNegative) {
    // The player has The Negative already
    // (which can occur if Eden, or in a diversity race, or in Season 7)
    // Spawn The Polaroid instead
    return PhotoSituation.POLAROID;
  }

  if (g.race.status === "in progress") {
    return getPhotoSituationRace(g.race.goal);
  }

  // They are doing a normal non-client run, so by default spawn both photos
  return PhotoSituation.BOTH;
}

function getPhotoSituationRace(goal: RaceGoal) {
  switch (goal) {
    case "Blue Baby": {
      return PhotoSituation.POLAROID;
    }

    case "The Lamb": {
      return PhotoSituation.NEGATIVE;
    }

    case "Mega Satan":
    case "Hush":
    case "Delirium":
    case "Boss Rush":
    case "Everything":
    case "Custom": {
      // Give the player a choice between the photos for races to alternate objectives
      return PhotoSituation.BOTH;
    }

    default: {
      ensureAllCases(goal);
      return PhotoSituation.RANDOM_BOSS_ITEM;
    }
  }
}

function doPhotoSituation(situation: PhotoSituation) {
  const roomSeed = g.r.GetSpawnSeed();

  // Define pedestal positions
  const posCenter = Vector(320, 360);
  const posCenterLeft = Vector(280, 360);
  const posCenterRight = Vector(360, 360);

  switch (situation) {
    case PhotoSituation.POLAROID: {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        posCenter,
        Vector.Zero,
        null,
        CollectibleType.COLLECTIBLE_POLAROID,
        roomSeed,
      );
      break;
    }

    case PhotoSituation.NEGATIVE: {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        posCenter,
        Vector.Zero,
        null,
        CollectibleType.COLLECTIBLE_NEGATIVE,
        roomSeed,
      );
      break;
    }

    case PhotoSituation.BOTH: {
      const polaroid = g.g
        .Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          posCenterLeft,
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
          posCenterRight,
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

    case PhotoSituation.RANDOM_BOSS_ITEM: {
      // If we spawn a boss item using an InitSeed of 0, the item will always be Magic Mushroom,
      // so use the room seed instead
      // Spawning an item with a SubType of 0 will make a random item of the pool according to the
      // room type
      if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_THERES_OPTIONS)) {
        // If the player has There's Options, they should get two boss items instead of 1
        const item1 = g.g
          .Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COLLECTIBLE,
            posCenterLeft,
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
            posCenterRight,
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
          posCenter,
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
