/*
// Card.CARD_JUSTICE (9)
export function justice(): void {
  postItemPickup.insertNearestCoin();
  postItemPickup.insertNearestKey();
  postItemPickup.insertNearestBomb();
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
*/
