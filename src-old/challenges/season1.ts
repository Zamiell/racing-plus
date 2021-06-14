/*
// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted9(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+9 (Season 1) challenge.");

  // Give extra items to some characters
  if (character === PlayerType.PLAYER_KEEPER) {
    postGameStartedKeeper();
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted14(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+14 (Season 1) challenge.");

  // Give extra items to some characters
  switch (character) {
    // 0
    case PlayerType.PLAYER_ISAAC: {
      // Add the Battery
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_BATTERY, 0, false); // 63
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_BATTERY); // 63

      // Make Isaac start with a double charge instead of a single charge
      g.p.SetActiveCharge(12);
      g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE); // 170

      break;
    }

    // 1
    case PlayerType.PLAYER_MAGDALENA: {
      // Add the Soul Jar
      g.p.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_SOUL_JAR, 0, false);
      // (the Soul Jar does not appear in any pools)
      break;
    }

    // 13
    case PlayerType.PLAYER_LILITH: {
      // Lilith starts with the Schoolbag by default
      g.p.AddCollectible(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
        0,
        false,
      );
      g.itemPool.RemoveCollectible(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(CollectibleType.COLLECTIBLE_BOX_OF_FRIENDS, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_BOX_OF_FRIENDS);

      // Reorganize the items on the item tracker
      Isaac.DebugString("Removing collectible 412 (Cambion Conception)");
      Isaac.DebugString("Adding collectible 412 (Cambion Conception)");

      break;
    }

    // 14
    case PlayerType.PLAYER_KEEPER: {
      postGameStartedKeeper();
      break;
    }

    // 15
    case PlayerType.PLAYER_APOLLYON: {
      // Apollyon starts with the Schoolbag by default
      g.p.AddCollectible(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
        0,
        false,
      );
      g.itemPool.RemoveCollectible(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(CollectibleType.COLLECTIBLE_VOID, -1);
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_VOID);

      break;
    }

    default: {
      break;
    }
  }
}

function postGameStartedKeeper() {
  // Add the items
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_GREEDS_GULLET);
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_DUALITY);

  // Grant two extra coin/heart containers
  g.p.AddCoins(24); // Keeper starts with 1 coin so we only need to give 24
  g.p.AddCoins(1); // This fills in the 1st new heart container
  g.p.AddCoins(25); // Add a 2nd container
  g.p.AddCoins(1); // This fills in the 2nd new heart container
}
*/
