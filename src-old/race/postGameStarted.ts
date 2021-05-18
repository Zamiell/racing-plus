import { ChallengeCustom } from "../challenges/enums";
import * as season7diversity from "../challenges/season7diversity";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import * as sprites from "../sprites";
import { CollectibleTypeCustom } from "../types/enums";

// This occurs when first going into the game and after a reset occurs mid-race
export function main(): boolean {
  // Do special ruleset related initialization first
  // (we want to be able to do runs of them without using the R+ client)
  if (g.race.rFormat === "pageant") {
    pageant();
    return false;
  }

  // Now, perform race validation
  // If we are not in a race, don't do anything
  if (g.race.status === "none") {
    return false;
  }

  // Local variables
  const character = g.p.GetPlayerType();
  const customRun = g.seeds.IsCustomRun();
  const startSeedString = g.seeds.GetStartSeedString();
  const challenge = Isaac.GetChallenge();

  // Validate that we are not on a custom challenge
  if (challenge !== 0 && g.race.rFormat !== "custom") {
    g.g.Fadeout(0.05, FadeoutTarget.FADEOUT_MAIN_MENU);
    Isaac.DebugString(
      "We are in a race but also in a custom challenge; fading out back to the menu.",
    );
    return false;
  }

  // Validate the difficulty (hard mode / Greed mode) for races
  if (
    g.race.difficulty === "normal" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL &&
    g.race.rFormat !== "custom"
  ) {
    Isaac.DebugString(
      `Race error: Supposed to be on easy mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    return false;
  }
  if (
    g.race.difficulty === "hard" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_HARD &&
    g.race.rFormat !== "custom"
  ) {
    Isaac.DebugString(
      `Race error: Supposed to be on hard mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    return false;
  }

  if (g.race.rFormat === "seeded" && g.race.status === "in progress") {
    // Validate that we are on the intended seed
    if (startSeedString !== g.race.seed) {
      // Doing a "seed #### ####" here does not work for some reason,
      // so mark to reset on the next frame
      g.run.restart = true;
      Isaac.DebugString("Restarting because we were not on the right seed.");
      return true;
    }
  } else if (g.race.rFormat === "unseeded" || g.race.rFormat === "diversity") {
    // Validate that we are not on a set seed
    // (this will be true if we are on a set seed or on a challenge,
    // but we won't get this far if we are on a challenge)
    if (
      customRun &&
      !g.debug // Make an exception if we are trying to debug something on a certain seed
    ) {
      // If the run started with a set seed,
      // this will change the reset behavior to that of an unseeded run
      g.seeds.Reset();

      // Doing a "restart" command here does not work for some reason,
      // so mark to restart on the next frame
      g.run.restart = true;
      Isaac.DebugString("Restarting because we were on a set seed.");
      return true;
    }
  }

  // Validate that we are on the right character
  if (character !== g.race.character && g.race.rFormat !== "custom") {
    // Doing a "restart" command here does not work for some reason,
    // so mark to restart on the next frame
    g.run.restart = true;
    Isaac.DebugString("Restarting because we were not on the right character.");
    return true;
  }

  // The Racing+ client will look for this message to determine that
  // the user has successfully downloaded and is running the Racing+ Lua mod
  Isaac.DebugString("Race validation succeeded.");

  // Give extra items depending on the format
  if (g.race.rFormat === "unseeded") {
    if (g.race.ranked && g.race.solo) {
      unseededRankedSolo();
    } else {
      unseeded();
    }
  } else if (g.race.rFormat === "seeded") {
    seeded();
  } else if (g.race.rFormat === "diversity") {
    // If the diversity race has not started yet, don't give the items
    if (g.raceVars.started) {
      g.run.diversity = true; // Mark to not remove the 3 placeholder items later on
      diversity();
    }
  }

  return false;
}

function unseeded() {
  // Unseeded is like vanilla,
  // but the player will still start with More Options to reduce resetting time
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS, 0, false);
  misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_MORE_OPTIONS);

  // We don't want the costume to show
  g.p.RemoveCostume(
    g.itemConfig.GetCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS),
  );

  // More Options will be removed upon entering the first Treasure Room
  g.run.removeMoreOptions = true;
}

function seeded() {
  // Local variables
  const character = g.p.GetPlayerType();

  // Give the player extra starting items (for seeded races)
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS)) {
    // Eden can start with The Compass
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_COMPASS, 0, false);
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_COMPASS);
  }
  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) {
    // Eden and Samael start with the Schoolbag
    g.p.AddCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      0,
      false,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
    );
  }

  // Give the player the "Instant Start" item(s)
  let replacedD6 = false;
  for (const itemID of g.race.startingItems) {
    if (itemID === 600) {
      // The 13 luck is a special case
      g.p.AddCollectible(CollectibleTypeCustom.COLLECTIBLE_13_LUCK, 0, false);
    } else {
      const maxCharges = misc.getItemMaxCharges(itemID);
      g.p.AddCollectible(itemID, maxCharges, true);
      g.itemPool.RemoveCollectible(itemID);

      if (itemID === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) {
        // Remove the 2 soul hearts that it gives
        g.p.AddSoulHearts(-4);

        // Re-heal Judas back to 1 red heart so that they can properly use the Crown of Light
        // (this should do nothing on all of the other characters)
        g.p.AddHearts(1);
      }
    }
  }

  // Find out if we replaced the D6
  const newActiveItem = g.p.GetActiveItem();
  const newActiveCharge = g.p.GetActiveCharge();
  if (newActiveItem !== CollectibleType.COLLECTIBLE_D6) {
    // We replaced the D6 with an active item, so put the D6 back and put this item in the Schoolbag
    replacedD6 = true;
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);
    schoolbag.put(newActiveItem, newActiveCharge);
  }

  // Give the player extra Schoolbag items, depending on the character
  if (!replacedD6) {
    switch (character) {
      // 1
      case PlayerType.PLAYER_MAGDALENA: {
        schoolbag.put(CollectibleType.COLLECTIBLE_YUM_HEART, -1);
        g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_YUM_HEART);
        break;
      }

      // 3
      case PlayerType.PLAYER_JUDAS: {
        // We need to touch Book of Belial to lock in the Bookworm touch
        g.p.AddCollectible(
          CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL,
          0,
          false,
        );
        g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);
        schoolbag.put(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, -1);
        g.itemPool.RemoveCollectible(
          CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL,
        );
        break;
      }

      // 4
      case PlayerType.PLAYER_XXX: {
        schoolbag.put(CollectibleType.COLLECTIBLE_POOP, -1);
        g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_POOP);
        break;
      }

      // 5
      case PlayerType.PLAYER_EVE: {
        schoolbag.put(CollectibleType.COLLECTIBLE_RAZOR_BLADE, -1);
        g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_RAZOR_BLADE);
        break;
      }

      // 10
      case PlayerType.PLAYER_THELOST: {
        schoolbag.put(CollectibleType.COLLECTIBLE_D4, -1);
        g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D4);
        break;
      }

      // 13
      case PlayerType.PLAYER_LILITH: {
        schoolbag.put(CollectibleType.COLLECTIBLE_BOX_OF_FRIENDS, -1);
        g.itemPool.RemoveCollectible(
          CollectibleType.COLLECTIBLE_BOX_OF_FRIENDS,
        );
        break;
      }

      // 14
      case PlayerType.PLAYER_KEEPER: {
        schoolbag.put(CollectibleType.COLLECTIBLE_WOODEN_NICKEL, -1);
        g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_WOODEN_NICKEL);
        break;
      }

      // 15
      case PlayerType.PLAYER_APOLLYON: {
        schoolbag.put(CollectibleType.COLLECTIBLE_VOID, -1);
        g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_VOID);
        break;
      }

      default: {
        break;
      }
    }
  }

  // Reorganize the items on the item tracker so that the "Instant Start" item comes after the
  // Schoolbag item
  for (const itemID of g.race.startingItems) {
    if (itemID === 600) {
      Isaac.DebugString(
        `Removing collectible ${CollectibleTypeCustom.COLLECTIBLE_13_LUCK}  (13 Luck)`,
      );
      Isaac.DebugString(
        `Adding collectible ${CollectibleTypeCustom.COLLECTIBLE_13_LUCK}  (13 Luck)`,
      );
    } else {
      Isaac.DebugString(`Removing collectible ${itemID}`);
      Isaac.DebugString(`Adding collectible ${itemID}`);
    }
  }

  // Remove Cain's Eye since we start with the Compass
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);

  // Since this race type has a custom death mechanic, we also want to remove the Broken Ankh
  // (since we need the custom revival to always take priority over random revivals)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_BROKEN_ANKH);

  // Initialize the sprites for the starting room
  // (don't show these graphics until the race starts)
  if (g.race.status === "in progress") {
    if (g.race.startingItems.length === 1) {
      sprites.init("seeded-starting-item", "seeded-starting-item");
      sprites.init("seeded-item1", g.race.startingItems[0].toString());
    } else if (g.race.startingItems.length === 2) {
      sprites.init("seeded-starting-build", "seeded-starting-build");
      sprites.init("seeded-item2", g.race.startingItems[0].toString());
      sprites.init("seeded-item3", g.race.startingItems[1].toString());
    } else if (g.race.startingItems.length === 4) {
      // Only the Mega Blast build has 4 starting items
      sprites.init("seeded-starting-build", "seeded-starting-build");
      sprites.init("seeded-item2", g.race.startingItems[1].toString());
      sprites.init("seeded-item3", g.race.startingItems[2].toString());
      // This will be to the left of 2
      sprites.init("seeded-item4", g.race.startingItems[0].toString());
      // This will be to the right of 3
      sprites.init("seeded-item5", g.race.startingItems[3].toString());
    }
    g.run.startingRoomGraphics = true;
  }

  Isaac.DebugString("Added seeded items.");
}

export function diversity(): void {
  // Local variables
  const trinket1 = g.p.GetTrinket(0); // This will be 0 if there is no trinket
  const challenge = Isaac.GetChallenge();

  // Give the player extra starting items (for diversity races)
  if (!g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM)) {
    // Eden and Samael start with the Schoolbag already
    g.p.AddCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      0,
      false,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
    );
  }
  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS)) {
    // More Options will be removed upon entering the first Treasure Room
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS, 0, false);
    misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_MORE_OPTIONS);

    // We don't want the costume to show
    g.p.RemoveCostume(
      g.itemConfig.GetCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS),
    );

    // We don't need to show this on the item tracker to reduce clutter
    g.run.removeMoreOptions = true;
  }

  // The server will have sent us the starting items
  let startingItems = g.race.startingItems;

  // We need to generate the starting items if ( we are in Season 7
  if (challenge === ChallengeCustom.R7_SEASON_7) {
    startingItems = season7diversity.generateDiversityStarts();
  }

  // Give the player their five random diversity starting items
  for (let i = 0; i < startingItems.length; i++) {
    const itemID = startingItems[i];

    if (i === 0) {
      // The first item is the active
      schoolbag.put(itemID, -1);
      if (g.run.schoolbag.item === CollectibleType.COLLECTIBLE_EDENS_SOUL) {
        g.run.schoolbag.charge = 0; // This is the only item that does not start with any charges
      }
      g.itemPool.RemoveCollectible(itemID);

      // Give them the item so that the player gets any initial pickups (e.g. Remote Detonator)
      // and the touch counts for transformations
      g.p.AddCollectible(itemID, 0, true);

      // Swap back for the D6
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);

      // Update the cache (in case we had an active item that granted stats, like A Pony)
      g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
      g.p.EvaluateItems();

      // Remove the costume, if ( any (some items give a costume, like A Pony)
      g.p.RemoveCostume(g.itemConfig.GetCollectible(itemID));
    } else if (i === 1 || i === 2 || i === 3) {
      // The second, third, and fourth items are the passives
      misc.giveItemAndRemoveFromPools(itemID);

      // Also remove the corresponding diversity placeholder items
      if (itemID === CollectibleType.COLLECTIBLE_INCUBUS) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
        );
      } else if (itemID === CollectibleType.COLLECTIBLE_SACRED_HEART) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
        );
      } else if (itemID === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
        );
      }
    } else if (i === 4) {
      // The fifth item is the trinket
      g.p.TryRemoveTrinket(trinket1); // It is safe to feed 0 to this function
      g.p.AddTrinket(itemID);
      g.p.UseActiveItem(
        CollectibleType.COLLECTIBLE_SMELTER,
        false,
        false,
        false,
        false,
      );

      // Regive Paper Clip to Cain, for example
      if (trinket1 !== 0) {
        g.p.AddTrinket(trinket1); // The game crashes if 0 is fed to this function
      }

      // Remove it from the trinket pool
      g.itemPool.RemoveTrinket(itemID);
    }
  }

  // Add item bans for diversity races
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_TECH_X);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D4);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D100);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_DINF);
  if (g.run.schoolbag.item === CollectibleType.COLLECTIBLE_BLOOD_RIGHTS) {
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_ISAACS_HEART);
  }
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_ISAACS_HEART)) {
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_BLOOD_RIGHTS);
  }
  if (challenge === ChallengeCustom.R7_SEASON_7) {
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_SOY_MILK)) {
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_LIBRA);
    }
    if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_LIBRA)) {
      g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOY_MILK);
    }
  }

  // Initialize the sprites for the starting room
  sprites.init("diversity-active", "diversity-active");
  sprites.init("diversity-passives", "diversity-passives");
  sprites.init("diversity-trinket", "diversity-trinket");
  sprites.init("diversity-item1", startingItems[0].toString());
  sprites.init("diversity-item2", startingItems[1].toString());
  sprites.init("diversity-item3", startingItems[2].toString());
  sprites.init("diversity-item4", startingItems[3].toString());
  sprites.init("diversity-item5", startingItems[4].toString());
  g.run.startingRoomGraphics = true;

  Isaac.DebugString("Added diversity items.");
}

function pageant() {
  // Add the extra items
  // (the extra luck is handled in the EvaluateCache callback)
  misc.giveItemAndRemoveFromPools(
    CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
  );
  schoolbag.put(CollectibleType.COLLECTIBLE_DADS_KEY, -1);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_DADS_KEY);

  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_MAXS_HEAD);
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_THERES_OPTIONS);
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_BELLY_BUTTON);
  misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_CANCER);

  g.p.AddTrinket(TrinketType.TRINKET_CANCER);
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CANCER);

  // Delete the trinket that drops from the Belly Button
  const trinkets = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TRINKET,
    -1,
    false,
    false,
  );
  for (const trinket of trinkets) {
    trinket.Remove();
  }
}

function unseededRankedSolo() {
  // The client will populate the starting items for the current season into the "startingItems"
  // variable
  for (const itemID of g.race.startingItems) {
    misc.giveItemAndRemoveFromPools(itemID);
  }
}
