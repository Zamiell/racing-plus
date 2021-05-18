import g from "../globals";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";
import { BIG_4_ITEMS, SEASON_5_ITEM_STARTS } from "./constants";
import { ChallengeCustom } from "./enums";

// We need to record the starting item on the first character
// so that we can avoid duplicate starting items later on
// Called from the "PostUpdate.CheckItemPickup()" function
export function preItemPickup(itemConfigItem: ItemConfigItem): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (
    challenge !== ChallengeCustom.R7_SEASON_5 ||
    g.run.passiveItems.length !== 1 ||
    g.speedrun.characterNum !== 1 ||
    // Characters can start with a starting item,
    // so we want to make sure that we enter at least one room
    g.run.roomsEntered < 2
  ) {
    return;
  }

  let foundStartingItem = false;
  for (let i = 0; i < g.season5.remainingStartingItems.length; i++) {
    const remainingItem = g.season5.remainingStartingItems[i];
    if (remainingItem === itemConfigItem.ID) {
      g.season5.remainingStartingItems.splice(i, 1);
      foundStartingItem = true;
      break;
    }
  }
  if (!foundStartingItem) {
    Isaac.DebugString(
      "The player started an item that was not in the starting items array. Not recording the item.",
    );
    return;
  }

  g.season5.selectedStartingItems.push(itemConfigItem.ID);
  Isaac.DebugString(
    `Starting item ${itemConfigItem.ID} on the first character of an instant-start speedrun.`,
  );
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStartedFirstCharacter(): void {
  g.season5.remainingStartingItems = [...SEASON_5_ITEM_STARTS];
  g.season5.selectedStartingItems = [];
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  Isaac.DebugString("In the R+7 (Season 5) challenge.");

  // (Random Baby automatically starts with the Schoolbag)

  // Change the starting health from 3 red hearts to 1 red heart and 1 half soul heart
  g.p.AddMaxHearts(-4, false);
  g.p.AddSoulHearts(1);

  // On the first character, we will start an item normally
  // On the second character and beyond, a start will be randomly assigned
  if (g.speedrun.characterNum < 2) {
    return;
  }

  // As a safety measure,
  // check to see if the "selectedItemStarts" table has a value in it for the first character
  // (it should contain one item, equal to the item that was started on the first character)
  if (g.season5.selectedStartingItems.length < 1) {
    // Just assume that they started the Sad Onion
    g.season5.selectedStartingItems.push(CollectibleType.COLLECTIBLE_SAD_ONION);
  }

  // Check to see if the player has played a run with one of the big 4
  let alreadyStartedBig4 = false;
  for (const selectedItem of g.season5.selectedStartingItems) {
    if (BIG_4_ITEMS.includes(selectedItem as CollectibleType)) {
      alreadyStartedBig4 = true;
      break;
    }
  }

  // Check to see if a start is already assigned for this character number
  // (dying and resetting should not reassign the selected starting item)
  let startingItem = g.season5.selectedStartingItems[g.speedrun.characterNum];
  if (startingItem === undefined) {
    startingItem = getNewStartingItem(alreadyStartedBig4);
  }

  // Give it to the player and remove it from item pools
  misc.giveItemAndRemoveFromPools(startingItem);

  // Also remove the additional soul hearts from Crown of Light
  if (startingItem === CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT) {
    g.p.AddSoulHearts(-4);
  }
}

function getNewStartingItem(alreadyStartedBig4: boolean) {
  let seed = g.seeds.GetStartSeed();
  let alreadyStarted = true;
  let startingItem: CollectibleType | CollectibleTypeCustom;
  let startingItemIndex: int;
  do {
    seed = misc.incrementRNG(seed);
    math.randomseed(seed);

    if (alreadyStartedBig4) {
      startingItemIndex = math.random(
        4,
        g.season5.remainingStartingItems.length - 1,
      );
    } else if (g.speedrun.characterNum === 7) {
      // Guarantee at least one big 4 start
      startingItemIndex = math.random(0, 3);
    } else {
      startingItemIndex = math.random(
        0,
        g.season5.remainingStartingItems.length - 1,
      );
    }

    startingItem = g.season5.remainingStartingItems[startingItemIndex];

    // Check to see if we already started this item
    alreadyStarted = g.season5.selectedStartingItems.includes(startingItem);
  } while (!alreadyStarted);

  // Remove it from the remaining items left
  g.season5.remainingStartingItems.splice(startingItemIndex, 1);

  // Keep track of what item we are supposed to be starting on this character / run
  g.season5.selectedStartingItems.push(startingItem);

  return startingItem;
}
