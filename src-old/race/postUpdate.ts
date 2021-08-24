/*

function check3DollarBill() {
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_3_DOLLAR_BILL)
  ) {
    g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_3_DOLLAR_BILL);
    misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_3_DOLLAR_BILL);
    g.p.AddCollectible(
      CollectibleTypeCustom.COLLECTIBLE_3_DOLLAR_BILL_SEEDED,
      0,
      false,
    );
    Isaac.DebugString("Activated the custom 3 Dollar Bill for seeded races.");

    // Activate a new effect for it (pretending that we just walked into a new room)
    racePostNewRoom.threeDollarBill();
  }
}

*/
