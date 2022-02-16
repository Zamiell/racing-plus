import {
  arrayCopy,
  arrayEmpty,
  getRandomArrayElementAndRemove,
  log,
  MINUTE_IN_MILLISECONDS,
} from "isaacscript-common";
import g from "../../globals";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { giveCollectibleAndRemoveFromPools } from "../../utilGlobals";
import { drawErrorText } from "../mandatory/errors";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../util/restartOnNextFrame";
import { ChallengeCustom } from "./enums";
import { getCharacterOrderSafe } from "./speedrun";
import v from "./v";

const SEASON_2_CHARACTERS = [
  PlayerType.PLAYER_CAIN, // 2
  PlayerType.PLAYER_EVE, // 5
  PlayerType.PLAYER_BLACKJUDAS, // 12
  PlayerType.PLAYER_THEFORGOTTEN, // 16
  PlayerType.PLAYER_ISAAC_B, // 21
  PlayerType.PLAYER_SAMSON_B, // 27
  PlayerType.PLAYER_AZAZEL_B, // 28
];

/** Roughly matches the builds for online races in "builds.json". */
export const SEASON_2_STARTING_BUILDS = [
  // Treasure Room items
  [CollectibleType.COLLECTIBLE_CRICKETS_HEAD], // 4
  [CollectibleType.COLLECTIBLE_CRICKETS_BODY], // 224
  [CollectibleType.COLLECTIBLE_DEAD_EYE], // 373
  [CollectibleType.COLLECTIBLE_DEATHS_TOUCH], // 237
  [CollectibleType.COLLECTIBLE_DR_FETUS], // 52
  [CollectibleType.COLLECTIBLE_IPECAC], // 149
  [CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM], // 12
  // [CollectibleType.COLLECTIBLE_MOMS_KNIFE], // 114
  // (Mom's Knife is banned due to being too powerful)
  [CollectibleType.COLLECTIBLE_POLYPHEMUS], // 169
  [CollectibleType.COLLECTIBLE_PROPTOSIS], // 261
  [CollectibleType.COLLECTIBLE_TECH_5], // 244
  [CollectibleType.COLLECTIBLE_TECH_X], // 395
  [CollectibleType.COLLECTIBLE_C_SECTION], // 678

  // Devil Room items
  [CollectibleType.COLLECTIBLE_BRIMSTONE], // 118
  [CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID], // 399

  // Angel Room items
  [CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT], // 415
  [CollectibleType.COLLECTIBLE_SACRED_HEART], // 182
  // [CollectibleType.COLLECTIBLE_SPIRIT_SWORD], // 579
  // (Spirit Sword is banned due to being too powerful)
  [CollectibleType.COLLECTIBLE_REVELATION], // 643

  // Secret Room items
  [CollectibleType.COLLECTIBLE_EPIC_FETUS], // 168

  // Custom items
  // [CollectibleTypeCustom.COLLECTIBLE_SAWBLADE],
  // (Sawblade is banned due to not being powerful enough)

  // Custom builds
  [
    CollectibleType.COLLECTIBLE_20_20, // 245
    CollectibleType.COLLECTIBLE_INNER_EYE, // 2
  ],
  [
    CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
    CollectibleType.COLLECTIBLE_STEVEN, // 50
  ],
  [
    CollectibleType.COLLECTIBLE_GODHEAD, // 331
    CollectibleType.COLLECTIBLE_CUPIDS_ARROW, // 48
  ],
  [
    CollectibleType.COLLECTIBLE_HAEMOLACRIA, // 531
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],
  [
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
    CollectibleType.COLLECTIBLE_INCUBUS, // 360
  ],
  [
    CollectibleType.COLLECTIBLE_MONSTROS_LUNG, // 229
    CollectibleType.COLLECTIBLE_SAD_ONION, // 1
  ],
  [
    CollectibleType.COLLECTIBLE_TECHNOLOGY, // 68
    CollectibleType.COLLECTIBLE_LUMP_OF_COAL, // 132
  ],
  [
    CollectibleType.COLLECTIBLE_TWISTED_PAIR, // 698
    CollectibleType.COLLECTIBLE_TWISTED_PAIR, // 698
  ],
  [
    CollectibleType.COLLECTIBLE_POINTY_RIB, // 544
    CollectibleType.COLLECTIBLE_EVES_MASCARA, // 310
  ],
  [
    CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
    CollectibleType.COLLECTIBLE_MYSTERIOUS_LIQUID, // 317
    CollectibleTypeCustom.COLLECTIBLE_13_LUCK, // Custom
  ],
  [
    CollectibleType.COLLECTIBLE_EYE_OF_THE_OCCULT, // 572
    CollectibleType.COLLECTIBLE_LOKIS_HORNS, // 87
    CollectibleTypeCustom.COLLECTIBLE_15_LUCK,
  ],
  /*
  [
    CollectibleType.COLLECTIBLE_DISTANT_ADMIRATION, // 57
    CollectibleType.COLLECTIBLE_FRIEND_ZONE, // 364
    CollectibleType.COLLECTIBLE_FOREVER_ALONE, // 128
    CollectibleType.COLLECTIBLE_BFFS, // 247
  ],
  */
  // (the fly build is banned due to not being fun)
];

const SEASON_2_FORGOTTEN_BUILDS = new Set<
  CollectibleType | CollectibleTypeCustom
>([
  CollectibleType.COLLECTIBLE_MAGIC_MUSHROOM, // 12
  CollectibleType.COLLECTIBLE_CHOCOLATE_MILK, // 69
  CollectibleType.COLLECTIBLE_POLYPHEMUS, // 169
  CollectibleType.COLLECTIBLE_SACRED_HEART, // 182
  CollectibleType.COLLECTIBLE_PROPTOSIS, // 261
  CollectibleType.COLLECTIBLE_HAEMOLACRIA, // 531
]);

/** An array containing every index that is not on the above build whitelist. */
const SEASON_2_FORGOTTEN_EXCEPTIONS: int[] = [];
for (let i = 0; i < SEASON_2_STARTING_BUILDS.length; i++) {
  const build = SEASON_2_STARTING_BUILDS[i];
  const firstCollectible = build[0];
  if (!SEASON_2_FORGOTTEN_BUILDS.has(firstCollectible)) {
    SEASON_2_FORGOTTEN_EXCEPTIONS.push(i);
  }
}

/** How long the randomly-selected character & build combination is "locked-in". */
const SEASON_2_LOCK_MINUTES = 0.2; // 1.5; // TODO
const SEASON_2_LOCK_MILLISECONDS =
  SEASON_2_LOCK_MINUTES * MINUTE_IN_MILLISECONDS;

const timeGameOpened = Isaac.GetTime();

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  drawErrors();
}

function drawErrors() {
  if (v.run.errors.gameRecentlyOpened) {
    const time = Isaac.GetTime();
    const endTime = timeGameOpened + SEASON_2_LOCK_MILLISECONDS;
    const millisecondsRemaining = endTime - time;
    const secondsRemaining = Math.ceil(millisecondsRemaining / 1000);
    const text = getSeason2ErrorMessage("opening the game", secondsRemaining);
    drawErrorText(text);
    return true;
  }

  return false;
}

function getSeason2ErrorMessage(action: string, secondsRemaining: int) {
  const suffix = secondsRemaining > 1 ? "s" : "";
  const secondsRemainingText = `${secondsRemaining} second${suffix}`;
  const secondSentence =
    secondsRemaining > 0
      ? `Please wait ${secondsRemainingText} and then restart.`
      : "Please restart.";
  return `You are not allowed to start a new Season 2 run so soon after ${action}. ${secondSentence}`;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  if (checkErrors()) {
    return;
  }

  removeItemsFromPools();
  checkFirstCharacterRefresh();

  const startingCharacter = getStartingCharacter();
  const startingBuildIndex = getStartingBuildIndex(startingCharacter);

  if (character !== startingCharacter) {
    restartOnNextFrame();
    setRestartCharacter(startingCharacter);
    log(
      `Restarting because we are on character ${character} and we need to be on character ${startingCharacter} (for season 2).`,
    );
    return;
  }

  giveStartingItems(player, startingBuildIndex);
}

function checkErrors() {
  const time = Isaac.GetTime();

  // Game recently opened
  const gameUnlockTime = timeGameOpened + SEASON_2_LOCK_MILLISECONDS;
  v.run.errors.gameRecentlyOpened = time <= gameUnlockTime;

  return v.run.errors.gameRecentlyOpened;
}

function removeItemsFromPools() {
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOL);
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);
  // g.itemPool.RemoveTrinket(TrinketType.TRINKET_BROKEN_ANKH); // TODO is this needed?
}

function checkFirstCharacterRefresh() {
  if (v.persistent.characterNum !== 1) {
    return;
  }

  const time = Isaac.GetTime();
  if (v.persistent.timeAssigned === null || v.persistent.timeAssigned > time) {
    // It is possible for the time assignment to be in the future, since it is based on the time
    // since the operating system started
    v.persistent.timeAssigned = time;
    log(`Season 2 - Reset timeAssigned to: ${v.persistent.timeAssigned}`);
  }

  const buildLockedUntilTime =
    v.persistent.timeAssigned + SEASON_2_LOCK_MILLISECONDS;
  if (
    time <= buildLockedUntilTime &&
    v.persistent.selectedCharacters.length > 0 &&
    v.persistent.selectedBuildIndexes.length > 0
  ) {
    return;
  }

  refreshStartingCharactersAndBuilds();
}

function refreshStartingCharactersAndBuilds() {
  arrayEmpty(v.persistent.selectedCharacters);
  v.persistent.remainingCharacters = arrayCopy(SEASON_2_CHARACTERS);

  arrayEmpty(v.persistent.selectedBuildIndexes);
  arrayEmpty(v.persistent.remainingBuildIndexes);
  for (let i = 0; i < SEASON_2_STARTING_BUILDS.length; i++) {
    v.persistent.remainingBuildIndexes.push(i);
  }

  log("Season 2 - refreshed starting characters and builds.");
}

function getStartingCharacter() {
  // First, handle the case where there is no old starting character at all
  const oldStartingCharacter =
    v.persistent.selectedCharacters[v.persistent.characterNum];
  if (oldStartingCharacter !== undefined) {
    log(
      `Season 2 - Using previously selected character: ${oldStartingCharacter}`,
    );
    return oldStartingCharacter;
  }

  const characterExceptions =
    v.persistent.lastSelectedCharacter === null
      ? []
      : [v.persistent.lastSelectedCharacter];

  const startingCharacter = getRandomArrayElementAndRemove(
    v.persistent.remainingCharacters,
    undefined,
    characterExceptions,
  );

  v.persistent.selectedCharacters.push(startingCharacter);
  v.persistent.lastSelectedCharacter = startingCharacter;
  v.persistent.timeAssigned = Isaac.GetTime();

  log(`Season 2 - Selected character: ${startingCharacter}`);

  return startingCharacter;
}

function getStartingBuildIndex(character: PlayerType) {
  // First, handle the case where there is no old starting build at all
  const oldStartingBuildIndex =
    v.persistent.selectedBuildIndexes[v.persistent.characterNum];
  if (oldStartingBuildIndex !== undefined) {
    log(`Season 2 - Using previously selected build: ${oldStartingBuildIndex}`);
    return oldStartingBuildIndex;
  }

  const buildExceptions: int[] = [];

  // Don't get the same starting build as the one we just played
  if (v.persistent.lastSelectedBuildIndex !== null) {
    buildExceptions.push(v.persistent.lastSelectedBuildIndex);
  }

  // Don't get starting builds that we have vetoed
  const vetoedBuilds = getCharacterOrderSafe();
  buildExceptions.push(...vetoedBuilds);

  // Don't get starting builds that don't synergize with the current character
  if (character === PlayerType.PLAYER_EVE) {
    const buildIndex = getBuildIndexFor(
      CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT,
    );
    buildExceptions.push(buildIndex);
  } else if (character === PlayerType.PLAYER_THEFORGOTTEN) {
    buildExceptions.push(...SEASON_2_FORGOTTEN_EXCEPTIONS);
  }

  const startingBuildIndex = getRandomArrayElementAndRemove(
    v.persistent.remainingBuildIndexes,
    undefined,
    buildExceptions,
  );
  v.persistent.selectedBuildIndexes.push(startingBuildIndex);
  v.persistent.lastSelectedBuildIndex = startingBuildIndex;

  log(`Season 2 - Selected build index: ${startingBuildIndex}`);

  return startingBuildIndex;
}

function getBuildIndexFor(collectibleType: CollectibleType) {
  for (let i = 0; i < SEASON_2_STARTING_BUILDS.length; i++) {
    const build = SEASON_2_STARTING_BUILDS[i];
    const firstCollectible = build[0];
    if (firstCollectible === collectibleType) {
      return i;
    }
  }

  return error(
    `Failed to find the season 2 build index for: ${collectibleType}`,
  );
}

function giveStartingItems(player: EntityPlayer, startingBuildIndex: int) {
  // Everyone starts with the Compass in this season
  giveCollectibleAndRemoveFromPools(
    player,
    CollectibleType.COLLECTIBLE_COMPASS,
  );

  const startingBuild = SEASON_2_STARTING_BUILDS[startingBuildIndex];
  for (const itemID of startingBuild) {
    giveCollectibleAndRemoveFromPools(player, itemID);
  }
}

// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.ACTION_CONSOLE (28)
export function isActionTriggeredConsole(): boolean | void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return undefined;
  }

  return false;
}

// ModCallbacks.MC_PRE_SPAWN_CLEAN_AWARD (70)
export function preSpawnClearAward(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  checkResetTimeAssigned();
}

/** Reset the starting character/build timer if we just killed the Basement 2 boss. */
function checkResetTimeAssigned() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();

  if (stage === 2 && roomType === RoomType.ROOM_BOSS) {
    v.persistent.timeAssigned = 0;
  }
}
