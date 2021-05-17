import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import {
  SEASON_9_CHARACTER_ITEM_BANS,
  SEASON_9_HISTORY_DATA_LABEL,
  SEASON_9_ITEM_LOCK_TIME_MILLISECONDS,
  SEASON_9_STARTING_BUILDS,
} from "./constants";
import { ChallengeCustom } from "./enums";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStartedFirstCharacter(): void {
  if (RacingPlusData === undefined) {
    return;
  }

  if (
    Isaac.GetTime() - g.season9.timeBuildAssigned >=
    SEASON_9_ITEM_LOCK_TIME_MILLISECONDS
  ) {
    g.season9.selectedStartingBuildIndexes = [];
  }

  if (g.season9.loadedSaveDat) {
    return;
  }

  g.season9.loadedSaveDat = true;
  const historicalBuildIndexes = RacingPlusData.Get(
    SEASON_9_HISTORY_DATA_LABEL,
  ) as int[] | undefined;
  if (historicalBuildIndexes === undefined) {
    g.season9.historicalBuildIndexes = [];
    RacingPlusData.Set(
      SEASON_9_HISTORY_DATA_LABEL,
      g.season9.historicalBuildIndexes,
    );
  } else {
    g.season9.historicalBuildIndexes = historicalBuildIndexes;
    const lastStartedBuildIndex =
      historicalBuildIndexes[historicalBuildIndexes.length - 1];
    g.season9.selectedStartingBuildIndexes = [lastStartedBuildIndex];
    g.season9.timeBuildAssigned = Isaac.GetTime();
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // Local variables
  const character = g.p.GetPlayerType();

  Isaac.DebugString("In the R+7 (Season 9) challenge.");

  // Character-specific items
  switch (character) {
    // 0
    case PlayerType.PLAYER_ISAAC: {
      const clockWorkAssembly = Isaac.GetItemIdByName("Clockwork Assembly");
      schoolbag.put(clockWorkAssembly, -1);
      break;
    }

    // 3
    case PlayerType.PLAYER_JUDAS: {
      g.p.AddHearts(1);
      break;
    }

    // 4
    case PlayerType.PLAYER_XXX: {
      misc.giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_SPIRIT_NIGHT);
      break;
    }

    // 8
    case PlayerType.PLAYER_LAZARUS: {
      g.p.SetPill(0, PillColor.PILL_NULL);
      break;
    }

    default: {
      break;
    }
  }

  // Everyone starts with a random passive item / build
  // Check to see if a start is already assigned for this character number
  // (dying and resetting should not reassign the selected starting item)
  let startingBuildIndex =
    g.season9.selectedStartingBuildIndexes[g.speedrun.characterNum];
  if (startingBuildIndex === null) {
    startingBuildIndex = getRandomStartingBuildIndex();

    // Keep track of what builds we start
    g.season9.selectedStartingBuildIndexes[
      g.speedrun.characterNum
    ] = startingBuildIndex;

    // Mark down the time that we assigned this item
    g.season9.timeBuildAssigned = Isaac.GetTime();

    // Record it for historical purposes (but only keep track of the past X builds)
    g.season9.historicalBuildIndexes.push(startingBuildIndex);
    while (
      g.season9.historicalBuildIndexes.length >
      math.floor(SEASON_9_STARTING_BUILDS.length / 2)
    ) {
      g.season9.historicalBuildIndexes.splice(0, 1);
    }
    RacingPlusData.Set(
      SEASON_9_HISTORY_DATA_LABEL,
      g.season9.historicalBuildIndexes,
    );
  }

  // Give the items to the player (and remove the items from the pools)
  const startingBuild = SEASON_9_STARTING_BUILDS[startingBuildIndex];
  for (const itemID of startingBuild) {
    misc.giveItemAndRemoveFromPools(itemID);

    // (the PostItemPickup function will be called because the Racing+ PostGameStarted callback
    // runs before the Racing+ Rebalanced one)
  }
}

function getRandomStartingBuildIndex() {
  // Local variables
  const seed = g.seeds.GetStartSeed();

  // Shortcut the logic if we are debugging
  if (g.season9.setBuild !== null) {
    const setBuild = g.season9.setBuild;
    g.season9.setBuild = null;
    Isaac.DebugString(`Using the debug set build of: ${setBuild}`);
    return setBuild;
  }

  // Build a list of build indexes that we have not started yet in past runs
  let unplayedStartingBuildIndexes = makeValidStartingBuildIndexes();

  if (unplayedStartingBuildIndexes.length === 0) {
    // We have played every item (with the potential exception of a character-banned item),
    // so delete the history (with the exception of the last started item)
    const lastStartedBuildIndex =
      g.season9.historicalBuildIndexes[
        g.season9.historicalBuildIndexes.length - 1
      ];
    g.season9.historicalBuildIndexes = [lastStartedBuildIndex];
    RacingPlusData.Set(
      SEASON_9_HISTORY_DATA_LABEL,
      g.season9.historicalBuildIndexes,
    );

    // Re-get the valid starting build indexes
    // This will always have a size greater than 0 now
    unplayedStartingBuildIndexes = makeValidStartingBuildIndexes();
  }

  math.randomseed(seed);
  const randomIndexOfIndexArray = math.random(
    0,
    unplayedStartingBuildIndexes.length - 1,
  );
  const randomIndex = unplayedStartingBuildIndexes[randomIndexOfIndexArray];

  return randomIndex;
}

function makeValidStartingBuildIndexes() {
  const unplayedStartingBuildIndexes = [];

  for (let i = 0; i < SEASON_9_STARTING_BUILDS.length; i++) {
    if (
      // If we have not started this build already on this 7-character run
      !g.season9.selectedStartingBuildIndexes.includes(i) &&
      // And we have not started this build recently on a previous 7-character run
      !g.season9.historicalBuildIndexes.includes(i) &&
      // And this build is not banned on this character
      !isBuildBannedOnThisCharacter(i)
    ) {
      unplayedStartingBuildIndexes.push(i);
    }
  }

  return unplayedStartingBuildIndexes;
}

function isBuildBannedOnThisCharacter(buildIndex: int) {
  // Local variables
  const character = g.p.GetPlayerType();
  const build = SEASON_9_STARTING_BUILDS[buildIndex];
  const primaryItem = build[0];

  const bannedItemsForThisCharacter = SEASON_9_CHARACTER_ITEM_BANS.get(
    character,
  );
  if (bannedItemsForThisCharacter === undefined) {
    return false;
  }

  return bannedItemsForThisCharacter.includes(primaryItem);
}

// Reset the starting item timer if we just killed the Basement 2 boss
export function postClearRoom(): void {
  // Local variables
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const challenge = Isaac.GetChallenge();

  if (
    challenge === ChallengeCustom.R7_SEASON_9 &&
    stage === 2 &&
    roomType === RoomType.ROOM_BOSS
  ) {
    g.season9.timeBuildAssigned = 0;
  }
}
