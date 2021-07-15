import g from "../../../globals";
import log from "../../../log";
import { giveItemAndRemoveFromPools, playingOnSetSeed } from "../../../misc";
import { CollectibleTypeCustom } from "../../../types/enums";
import {
  COLLECTIBLE_13_LUCK_SERVER_ID,
  COLLECTIBLE_15_LUCK_SERVER_ID,
} from "../constants";
import * as placeLeft from "../placeLeft";
import * as raceRoom from "../raceRoom";
import * as socket from "../socket";
import * as socketFunctions from "../socketFunctions";
import * as sprites from "../sprites";
import * as startingRoom from "../startingRoom";
import * as tempMoreOptions from "../tempMoreOptions";
import * as topSprite from "../topSprite";

export function main(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  resetRaceVars();
  socket.postGameStarted();
  sprites.resetAll();

  // For race validation purposes, use the 0th player
  const player = Isaac.GetPlayer();

  if (!validateRace(player)) {
    return;
  }
  socket.send("runMatchesRuleset");

  giveFormatItems(player);

  raceRoom.initSprites();
  startingRoom.initSprites();
  topSprite.postGameStarted();
  placeLeft.postGameStarted();
}

function resetRaceVars() {
  // If we finished a race and we reset,
  // we don't want to show any of the graphics on the starting screen
  // Clear out all of the race data to defaults
  // (the client will only explicitly reset the race data if we navigate back to the lobby)
  if (g.raceVars.finished) {
    socketFunctions.reset();
  }

  g.raceVars.finished = false;
  g.raceVars.finishedTime = 0;
}

export function giveFormatItems(player: EntityPlayer): void {
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

function validateRace(player: EntityPlayer) {
  return (
    validateInRace() &&
    validateChallenge() &&
    validateDifficulty() &&
    validateSeed() &&
    validateCharacter(player)
  );
}

function validateInRace() {
  return g.race.status !== "none";
}

function validateChallenge() {
  const challenge = Isaac.GetChallenge();

  if (challenge !== Challenge.CHALLENGE_NULL && g.race.format !== "custom") {
    g.g.Fadeout(0.05, FadeoutTarget.TITLE_SCREEN);
    log(
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
    log(
      `Error: Supposed to be on normal mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    topSprite.setErrorHardMode();
    return false;
  }

  if (
    g.race.difficulty === "hard" &&
    g.g.Difficulty !== Difficulty.DIFFICULTY_HARD &&
    g.race.format !== "custom"
  ) {
    log(
      `Error: Supposed to be on hard mode. (Currently, the difficulty is ${g.g.Difficulty}.)`,
    );
    topSprite.setErrorNormalMode();
    return false;
  }

  return true;
}

function validateSeed() {
  const startSeedString = g.seeds.GetStartSeedString();

  if (
    g.race.format === "seeded" &&
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
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
  // If the race has not started yet, don't give the items
  if (g.race.status !== "in progress" || g.race.myStatus !== "racing") {
    return;
  }

  // Unseeded is like vanilla,
  // but the player will still start with More Options to reduce the resetting time
  // Avoid giving more options on Tainted Dead Lazarus
  if (player.GetPlayerType() !== PlayerType.PLAYER_LAZARUS2_B) {
    tempMoreOptions.give(player);
  }
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
    } else if (itemID === COLLECTIBLE_15_LUCK_SERVER_ID) {
      itemID = CollectibleTypeCustom.COLLECTIBLE_15_LUCK;
    }

    giveItemAndRemoveFromPools(player, itemID);
  }

  // Remove Sol from pools, since it is mostly useless
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOL);

  // Remove Cain's Eye, since it is useless
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);

  // Since this race type has a custom death mechanic, we also want to remove the Broken Ankh
  // (since we need the custom revival to always take priority over random revivals)
  // g.itemPool.RemoveTrinket(TrinketType.TRINKET_BROKEN_ANKH);
}

export function diversity(player: EntityPlayer): void {
  // If the race has not started yet, don't give the items
  if (g.race.status !== "in progress" || g.race.myStatus !== "racing") {
    return;
  }

  const trinket1 = player.GetTrinket(0);

  // Avoid giving more options on Tainted Dead Lazarus
  if (player.GetPlayerType() !== PlayerType.PLAYER_LAZARUS2_B) {
    tempMoreOptions.give(player);
  }

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
      if (trinket1 !== 0) {
        player.TryRemoveTrinket(trinket1);
      }

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
        player.AddTrinket(trinket1);
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
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_GENESIS);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_ESAU_JR);

  // Trinket bans for diversity races
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_DICE_BAG);
}
