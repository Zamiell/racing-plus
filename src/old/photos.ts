import { ChallengeCustom } from "./challenges/enums";
import { ZERO_VECTOR } from "./constants";
import g from "./globals";
import * as misc from "./misc";

enum PhotoSituation {
  POLAROID,
  NEGATIVE,
  BOTH,
  RANDOM_BOSS_ITEM,
}

export function spawn(): void {
  // Local variables
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  // Only spawn the photos after the boss of Depths 2
  if (stage !== 6 || roomType !== RoomType.ROOM_BOSS) {
    return;
  }

  const situation = getPhotoSituation();
  doPhotoSituation(situation);
}

function getPhotoSituation() {
  // Local variables
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

  if (
    challenge === ChallengeCustom.R9_SEASON_1 ||
    challenge === ChallengeCustom.R14_SEASON_1
  ) {
    // Season 1 speedruns spawn only The Polaroid
    return PhotoSituation.POLAROID;
  }

  if (
    challenge === ChallengeCustom.R7_SEASON_2 ||
    challenge === ChallengeCustom.R7_SEASON_3 ||
    challenge === ChallengeCustom.R7_SEASON_4 ||
    challenge === ChallengeCustom.R7_SEASON_5 ||
    challenge === ChallengeCustom.R7_SEASON_6 ||
    challenge === ChallengeCustom.R7_SEASON_9 ||
    challenge === ChallengeCustom.R15_VANILLA
  ) {
    // Most seasons give the player a choice between the two photos
    return PhotoSituation.BOTH;
  }

  if (challenge === ChallengeCustom.R7_SEASON_8) {
    if (
      g.season8.touchedItems.includes(CollectibleType.COLLECTIBLE_POLAROID) &&
      g.season8.touchedItems.includes(CollectibleType.COLLECTIBLE_NEGATIVE)
    ) {
      return PhotoSituation.RANDOM_BOSS_ITEM;
    }
    if (g.season8.touchedItems.includes(CollectibleType.COLLECTIBLE_POLAROID)) {
      return PhotoSituation.NEGATIVE;
    }
    if (g.season8.touchedItems.includes(CollectibleType.COLLECTIBLE_NEGATIVE)) {
      return PhotoSituation.POLAROID;
    }
    return PhotoSituation.BOTH;
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

  if (challenge === ChallengeCustom.R7_SEASON_7) {
    // We need the Season 7 logic to be below the Polaroid and Negative checks above,
    // because it is possible to start with either The Polaroid or The Negative as one of the
    // three starting passive items
    if (
      g.season7.remainingGoals.length === 1 &&
      g.season7.remainingGoals[0] === "Blue Baby"
    ) {
      // The only thing left to do is to kill Blue Baby, so they must take The Polaroid
      return PhotoSituation.POLAROID;
    }

    if (
      g.season7.remainingGoals.length === 1 &&
      g.season7.remainingGoals[0] === "The Lamb"
    ) {
      // The only thing left to do is to kill The Lamb, so they must take The Negative
      return PhotoSituation.NEGATIVE;
    }

    // Give them a choice between the photos because he player needs the ability to choose what
    // goal they want on the fly
    return PhotoSituation.BOTH;
  }

  if (g.race.rFormat === "pageant") {
    // Give the player a choice between the photos on the Pageant Boy ruleset
    return PhotoSituation.BOTH;
  }

  if (g.race.status === "in progress" && g.race.goal === "Blue Baby") {
    // Races to Blue Baby need The Polaroid
    return PhotoSituation.POLAROID;
  }

  if (g.race.status === "in progress" && g.race.goal === "The Lamb") {
    // Races to The Lamb need The Negative
    return PhotoSituation.NEGATIVE;
  }

  if (
    g.race.status === "in progress" &&
    (g.race.goal === "Mega Satan" ||
      g.race.goal === "Hush" ||
      g.race.goal === "Delirium" ||
      g.race.goal === "Boss Rush" ||
      g.race.goal === "Everything" ||
      g.race.goal === "Custom")
  ) {
    // Give the player a choice between the photos for races to alternate objectives
    return PhotoSituation.BOTH;
  }

  // They are doing a normal non-client run, so by default spawn both photos
  return PhotoSituation.BOTH;
}

function doPhotoSituation(situation: PhotoSituation) {
  // Local variables
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
        ZERO_VECTOR,
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
        ZERO_VECTOR,
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
          ZERO_VECTOR,
          null,
          CollectibleType.COLLECTIBLE_POLAROID,
          roomSeed,
        )
        .ToPickup();
      if (polaroid !== null) {
        polaroid.TheresOptionsPickup = true;
      }

      // We don't want both of the photos to have the same RNG
      const newSeed = misc.incrementRNG(roomSeed);

      const negative = g.g
        .Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          posCenterRight,
          ZERO_VECTOR,
          null,
          CollectibleType.COLLECTIBLE_NEGATIVE,
          newSeed,
        )
        .ToPickup();
      if (negative !== null) {
        negative.TheresOptionsPickup = true;
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
            ZERO_VECTOR,
            null,
            0,
            roomSeed,
          )
          .ToPickup();
        if (item1 !== null) {
          item1.TheresOptionsPickup = true;
        }

        const nextSeed = misc.incrementRNG(roomSeed);
        const item2 = g.g
          .Spawn(
            EntityType.ENTITY_PICKUP,
            PickupVariant.PICKUP_COLLECTIBLE,
            posCenterRight,
            ZERO_VECTOR,
            null,
            0,
            nextSeed,
          )
          .ToPickup();
        if (item2 !== null) {
          item2.TheresOptionsPickup = true;
        }
      } else {
        g.g.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_COLLECTIBLE,
          posCenter,
          ZERO_VECTOR,
          null,
          0,
          roomSeed,
        );
      }

      break;
    }

    default: {
      error(`Invalid photo situation of: ${situation}`);
    }
  }
}
