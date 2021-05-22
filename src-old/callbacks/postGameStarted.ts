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



  if (challenge === Challenge.CHALLENGE_NULL && customRun) {
    // Racing+ also removes certain trinkets that mess up floor generation when playing on a set
    // seed
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SILVER_DOLLAR); // 110
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_BLOODY_CROWN); // 111

    // Racing+ also removes certain items and trinkets that change room drop calculation when
    // playing on a set seed
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_LUCKY_FOOT); // 46
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_DAEMONS_TAIL); // 22
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_CHILDS_HEART); // 34
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_RUSTED_KEY); // 36
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_MATCH_STICK); // 41
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_LUCKY_TOE); // 42
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SAFETY_CAP); // 44
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_ACE_SPADES); // 45
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_WATCH_BATTERY); // 72
  }

  // Give us custom racing items, depending on the character (mostly just the D6)
  if (characterInit()) {
    return;
  }

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

// This is done when a run is started
function characterInit() {
  // Local variables
  const character = g.p.GetPlayerType();
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const pillColor = g.p.GetPill(0);
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  // Since Eden starts with the Schoolbag in Racing+,
  // Eden will "miss out" on a passive item if they happen to start with the vanilla Schoolbag
  // Reset the game if this is the case
  if (
    character === PlayerType.PLAYER_EDEN &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG)
  ) {
    if (challenge === Challenge.CHALLENGE_NULL && customRun) {
      // In the unlikely event that they are playing on a specific seed with Eden,
      // the below code will cause the game to infinitely restart
      // Instead, just take away the vanilla Schoolbag and give them the Sad Onion as a replacement
      // for the passive item
      Isaac.DebugString(
        "Eden has started with the vanilla Schoolbag; removing it.",
      );
      g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG);
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_SCHOOLBAG);
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_SAD_ONION, 0, false);
    } else {
      g.run.restart = true;
      g.speedrun.fastReset = true;
      Isaac.DebugString(
        "Restarting because we started as Eden and got a vanilla Schoolbag.",
      );
      return true;
    }
  }

  // If they started with the Karma trinket, we need to delete it, since it is supposed to be
  // removed from the game
  // (this should be only possible on Eden)
  if (g.p.HasTrinket(TrinketType.TRINKET_KARMA)) {
    g.p.TryRemoveTrinket(TrinketType.TRINKET_KARMA);
  }

  // Give all characters the D6
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
  g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);

  // Do character-specific actions
  switch (character) {
    // 1
    case PlayerType.PLAYER_MAGDALENA: {
      // Identify the pill so that we will know what it is later on in the run
      // Racing+ Rebalanced has custom pill effects
      if (RacingPlusRebalancedVersion === null) {
        g.itemPool.IdentifyPill(pillColor);
        usePill.usedNewPill(pillColor, PillEffect.PILLEFFECT_SPEED_UP);
      }

      // Delete the starting pill
      g.p.SetPill(0, PillColor.PILL_NULL);

      // Update the speed cache so that we get the emulated speed bonus
      g.p.AddCacheFlags(CacheFlag.CACHE_SPEED);
      g.p.EvaluateItems();

      break;
    }

    // 2
    case PlayerType.PLAYER_CAIN: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 46 (Lucky Foot)");
      Isaac.DebugString("Adding collectible 46 (Lucky Foot)");
      break;
    }

    // 3
    case PlayerType.PLAYER_JUDAS: {
      // Judas needs to be at half of a red heart
      g.p.AddHearts(-1);
      break;
    }

    // 5
    case PlayerType.PLAYER_EVE: {
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_RAZOR_BLADE);
      // (this is given via an achievement and not from the "players.xml file")

      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 122 (Whore of Babylon)");
      Isaac.DebugString("Adding collectible 122 (Whore of Babylon)");
      Isaac.DebugString("Removing collectible 117 (Dead Bird)");
      Isaac.DebugString("Adding collectible 117 (Dead Bird)");

      break;
    }

    // 6
    case PlayerType.PLAYER_SAMSON: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 157 (Bloody Lust)");
      Isaac.DebugString("Adding collectible 157 (Bloody Lust)");

      // Remove the trinket as a quality of life fix
      // (since everyone just drops it anyway)
      g.p.TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART);

      break;
    }

    // 7
    case PlayerType.PLAYER_AZAZEL: {
      // Give him an additional half soul heart
      g.p.AddSoulHearts(1);

      break;
    }

    // 8
    case PlayerType.PLAYER_LAZARUS: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 214 (Anemic)");
      Isaac.DebugString("Adding collectible 214 (Anemic)");

      break;
    }

    // 9
    case PlayerType.PLAYER_EDEN: {
      // Find out what the passive item is
      let passiveItem: CollectibleType | undefined;
      for (let i = 1; i <= g.numTotalCollectibles; i++) {
        if (
          g.p.HasCollectible(i) &&
          i !== activeItem &&
          i !== CollectibleType.COLLECTIBLE_D6
        ) {
          passiveItem = i;
          break;
        }
      }
      if (passiveItem === undefined) {
        error("Failed to find out what Eden's passive item was.");
      }

      // Update the cache (in case we had an active item that granted stats, like A Pony)
      g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
      g.p.EvaluateItems();

      // Remove the costume, if any (some items give a costume, like A Pony)
      g.p.RemoveCostume(g.itemConfig.GetCollectible(activeItem));

      // Eden starts with the Schoolbag by default
      misc.giveItemAndRemoveFromPools(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(activeItem, activeCharge);

      // Make the D6 appear first on the item tracker
      Isaac.DebugString(`Removing collectible ${activeItem}`);
      Isaac.DebugString(`Removing collectible ${passiveItem}`);
      Isaac.DebugString(`Adding collectible ${activeItem}`);
      Isaac.DebugString(`Adding collectible ${passiveItem}`);

      // Store Eden's natural starting items so that we can show them to the player
      g.run.edenStartingItems[1] = activeItem;
      g.run.edenStartingItems[2] = passiveItem;

      break;
    }

    // 10
    case PlayerType.PLAYER_THELOST: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 313 (Holy Mantle)");
      Isaac.DebugString("Adding collectible 313 (Holy Mantle)");

      break;
    }

    // 13
    case PlayerType.PLAYER_LILITH: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 412 (Cambion Conception)");
      Isaac.DebugString("Adding collectible 412 (Cambion Conception)");

      break;
    }

    // 14
    case PlayerType.PLAYER_KEEPER: {
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_WOODEN_NICKEL);
      // (this is given via an achievement and not from the "players.xml file")

      break;
    }

    case PlayerTypeCustom.PLAYER_SAMAEL: {
      // Give him the Schoolbag with the Wraith Skull
      misc.giveItemAndRemoveFromPools(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(CollectibleTypeCustom.COLLECTIBLE_WRAITH_SKULL, 0); // Start at 0 charge

      break;
    }

    default: {
      break;
    }
  }
}

*/
