/*
export function main(): void {
  // Reset some RNG counters to the start RNG of the seed
  // (future drops will be based on the RNG from this initial random value)
  g.RNGCounter.bookOfSin = startSeed;
  g.RNGCounter.deadSeaScrolls = startSeed;
  g.RNGCounter.guppysHead = startSeed;
  g.RNGCounter.guppysCollar = startSeed;
  g.RNGCounter.butterBean = startSeed;
  g.RNGCounter.devilRoomKrampus = startSeed;
  g.RNGCounter.devilRoomChoice = startSeed;
  g.RNGCounter.devilRoomItem = startSeed;
  g.RNGCounter.devilRoomBeggar = startSeed;
  g.RNGCounter.angelRoomChoice = startSeed;
  g.RNGCounter.angelRoomItem = startSeed;
  g.RNGCounter.angelRoomMisc = startSeed;

  // Reset all graphics
  // (this is needed to prevent a bug where the "Race Start" room graphics
  // will flash on the screen before the room is actually entered)
  // (it also prevents the bug where if you reset during the stage animation,
  // it will permanently stay on the screen)
  sprites.sprites.clear();
  schoolbag.resetSprites();
  soulJar.resetSprites();
  g.speedrun.sprites = [];
  timer.spriteSetMap.clear();

  // Do more run initialization things specifically pertaining to speedruns
  speedrunPostGameStarted.main();

  // Do more run initialization things specifically pertaining to races
  if (racePostGameStarted.main()) {
    return;
  }

  // Remove the 3 placeholder items if this is not a diversity race
  if (!g.run.diversity && challenge !== ChallengeCustom.R7_SEASON_7) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
    );
  }

  // Make sure that the festive hat shows
  // (this is commented out if it is not currently a holiday)
  // g.p.AddNullCostume(NullItemID.ID_CHRISTMAS)
  // (this corresponds to "n016_Christmas.anm2" in the "costumes2.xml" file)

  // Call PostNewLevel manually (they get naturally called out of order)
  postNewLevel.newLevel();
}
