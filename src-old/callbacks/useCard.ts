import { ChallengeCustom } from "../challenges/enums";
import * as season8 from "../challenges/season8";
import g from "../globals";
import * as postItemPickup from "../postItemPickup";
import { CollectibleTypeCustom } from "../types/enums";

export function main(card: Card): void {
  // Display the streak text (because Racing+ removes the vanilla streak text)
  if (card === Card.RUNE_BLANK) {
    g.run.streakForce = true;
  } else if (!g.run.streakIgnore) {
    // We ignore blank runes because we want to show the streak text of the actual random effect
    g.run.streakText = g.itemConfig.GetCard(card).Name;
    g.run.streakFrame = Isaac.GetFrameCount();
  }
  g.run.streakIgnore = false;

  season8.useCard(card);
}

// Card.CARD_JUSTICE (9)
export function justice(): void {
  postItemPickup.insertNearestCoin();
  postItemPickup.insertNearestKey();
  postItemPickup.insertNearestBomb();
}

// Card.CARD_STRENGTH (12)
export function strength(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  // Keep track of whether or not we used a Strength card so that we can fix the bug with
  // fast-travel
  if (character !== PlayerType.PLAYER_KEEPER) {
    g.run.room.usedStrength = true;
    Isaac.DebugString("Used a Strength card.");
    if (
      character === PlayerType.PLAYER_THEFORGOTTEN ||
      character === PlayerType.PLAYER_THESOUL
    ) {
      g.run.room.usedStrengthChar = character;
    }
  } else if (g.run.keeper.baseHearts < 4) {
    // Only give Keeper another heart container if he has less than 2 base containers
    g.run.room.usedStrength = true;
    g.p.AddMaxHearts(2, true); // Give 1 heart container
    g.run.keeper.baseHearts += 2;
    Isaac.DebugString(
      "Gave 1 heart container to Keeper (via a Strength card).",
    );
  }

  // We don't have to check to see if "hearts === maxHearts" because
  // the Strength card will naturally heal Keeper for one heart containers
}

// Card.RUNE_BLACK (41)
export function blackRune(): void {
  // Local variables
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  // Voided pedestal items should count as starting a Challenge Room or the Boss Rush
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    -1,
    false,
    false,
  );
  if (collectibles.length > 0) {
    g.run.room.touchedPickup = true;
  }

  for (const collectible of collectibles) {
    if (collectible.SubType === CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT) {
      // The Checkpoint custom item is about to be deleted, so spawn another one
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        collectible.Position,
        collectible.Velocity,
        null,
        CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
        collectible.InitSeed,
      );
      Isaac.DebugString(
        "A black rune deleted a Checkpoint - spawning another one.",
      );

      // Kill the player if they are trying to cheat on the season 7 custom challenge
      if (challenge === ChallengeCustom.R7_SEASON_7 && stage === 8) {
        g.p.AnimateSad();
        g.p.Kill();
      }
    }
  }
}

// Card.CARD_QUESTIONMARK (48)
export function questionMark(): void {
  // Prevent the bug where using a ? Card while having Tarot Cloth will cause the D6 to get a free
  // charge (1/2)
  g.run.questionMarkCard = g.g.GetFrameCount();
}
