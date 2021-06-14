import g from "../../../globals";
import { giveItemAndRemoveFromPools, playingOnSetSeed } from "../../../misc";
import { CollectibleTypeCustom } from "../../../types/enums";
import * as socket from "../../optional/major/socket";
import { COLLECTIBLE_13_LUCK_SERVER_ID } from "../constants";
import * as tempMoreOptions from "../tempMoreOptions";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  // If we are not in a race, don't do anything
  if (g.race.status === "none") {
    return;
  }

  // For race validation purposes, use the 0th player
  const player = Isaac.GetPlayer();
  if (player === null) {
    return;
  }

  if (
    !validateChallenge() ||
    !validateDifficulty() ||
    !validateSeed() ||
    !validateCharacter(player)
  ) {
    return;
  }

  socket.send("runMatchesRuleset");

  // Give extra items depending on the format
  switch (g.race.format) {
    case "unseeded": {
      if (g.race.ranked && g.race.solo) {
        unseededRankedSolo(player);
      } else {
        unseeded(player);
      }

      break;
    }

    case "seeded": {
      seeded(player);
      break;
    }

    case "diversity": {
      diversity(player);
      break;
    }

    default: {
      break;
    }
  }
}

function validateChallenge() {
  const challenge = Isaac.GetChallenge();

  if (challenge !== Challenge.CHALLENGE_NULL && g.race.format !== "custom") {
    g.g.Fadeout(0.05, FadeoutTarget.TITLE_SCREEN);
    Isaac.DebugString(
      "We are in a race but also in a custom challenge; fading out back to the menu.",
    );
    return false;
  }

  return true;
}

function validateDifficulty() {
  if (
    g.race.difficulty === "normal" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL &&
    g.race.format !== "custom"
  ) {
    Isaac.DebugString(
      `Race error: Supposed to be on easy mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    return false;
  }

  if (
    g.race.difficulty === "hard" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_HARD &&
    g.race.format !== "custom"
  ) {
    Isaac.DebugString(
      `Race error: Supposed to be on hard mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    return false;
  }

  return true;
}

function validateSeed() {
  const startSeedString = g.seeds.GetStartSeedString();

  if (
    g.race.format === "seeded" &&
    g.race.status === "in progress" &&
    startSeedString !== g.race.seed
  ) {
    g.run.restart = true;
    return false;
  }

  if (
    (g.race.format === "unseeded" || g.race.format === "diversity") &&
    playingOnSetSeed()
  ) {
    // If the run started with a set seed,
    // this will change the reset behavior to that of an unseeded run
    g.seeds.Reset();

    g.run.restart = true;
    return false;
  }

  return true;
}

function validateCharacter(player: EntityPlayer) {
  const character = player.GetPlayerType();

  if (character !== g.race.character && g.race.format !== "custom") {
    g.run.restart = true;
    return false;
  }

  return true;
}

function unseeded(player: EntityPlayer) {
  // Unseeded is like vanilla,
  // but the player will still start with More Options to reduce the resetting time
  tempMoreOptions.give(player);
}

function unseededRankedSolo(player: EntityPlayer) {
  // The client will populate the starting items for the current season into the "startingItems"
  // variable
  for (const itemID of g.race.startingItems) {
    giveItemAndRemoveFromPools(player, itemID);
  }
}

function seeded(player: EntityPlayer) {
  // All seeded races start with the Compass to reduce mapping RNG
  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS)) {
    // Eden can start with The Compass
    giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_COMPASS);
  }

  // Seeded races start with an item or build (i.e. the "Instant Start" item)
  for (let itemID of g.race.startingItems) {
    // The "13 Luck" item is a special case
    // The server does not know what the real ID of it is,
    // so it uses an arbitrarily large number to represent it
    if (itemID === COLLECTIBLE_13_LUCK_SERVER_ID) {
      itemID = CollectibleTypeCustom.COLLECTIBLE_13_LUCK;
    }

    giveItemAndRemoveFromPools(player, itemID);
  }

  // Remove Cain's Eye from pools since we start with the Compass (making it essentially useless)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);

  // Since this race type has a custom death mechanic, we also want to remove the Broken Ankh
  // (since we need the custom revival to always take priority over random revivals)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_BROKEN_ANKH);

  // Initialize the sprites for the starting room
  // (but don't show these graphics until the race starts)
  if (g.race.status === "in progress") {
    // TODO
    /*
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
    */
  }
}

export function diversity(player: EntityPlayer): void {
  // If the diversity race has not started yet, don't give the items
  if (g.race.status !== "in progress") {
    return;
  }

  const trinket1 = player.GetTrinket(0);

  tempMoreOptions.give(player);

  // Give the player their five random diversity starting items
  const startingItems = g.race.startingItems;
  for (let i = 0; i < startingItems.length; i++) {
    const itemOrTrinketID = startingItems[i];

    if (i === 0) {
      // The first item is the active
      giveItemAndRemoveFromPools(player, itemOrTrinketID);
    } else if (i === 1 || i === 2 || i === 3) {
      // The second, third, and fourth items are the passives
      giveItemAndRemoveFromPools(player, itemOrTrinketID);

      // Also remove the corresponding diversity placeholder items
      if (itemOrTrinketID === CollectibleType.COLLECTIBLE_INCUBUS) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
        );
      } else if (itemOrTrinketID === CollectibleType.COLLECTIBLE_SACRED_HEART) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
        );
      } else if (
        itemOrTrinketID === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT
      ) {
        g.itemPool.RemoveCollectible(
          CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
        );
      }
    } else if (i === 4) {
      // The fifth item is the trinket
      player.TryRemoveTrinket(trinket1); // It is safe to feed 0 to this function
      player.AddTrinket(itemOrTrinketID);
      player.UseActiveItem(
        CollectibleType.COLLECTIBLE_SMELTER,
        false,
        false,
        false,
        false,
      );

      // Regive Paper Clip to Cain, for example
      if (trinket1 !== 0) {
        player.AddTrinket(trinket1); // The game crashes if 0 is fed to this function
      }

      // Remove it from the trinket pool
      g.itemPool.RemoveTrinket(itemOrTrinketID);
    }
  }

  // Add item bans for diversity races
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D4);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D100);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D_INFINITY);

  // Initialize the sprites for the starting room
  // TODO
  /*
  sprites.init("diversity-active", "diversity-active");
  sprites.init("diversity-passives", "diversity-passives");
  sprites.init("diversity-trinket", "diversity-trinket");
  sprites.init("diversity-item1", startingItems[0].toString());
  sprites.init("diversity-item2", startingItems[1].toString());
  sprites.init("diversity-item3", startingItems[2].toString());
  sprites.init("diversity-item4", startingItems[3].toString());
  sprites.init("diversity-item5", startingItems[4].toString());
  */
}
