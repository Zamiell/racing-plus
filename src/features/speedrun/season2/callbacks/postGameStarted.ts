import {
  arrayCopy,
  arrayEmpty,
  getRandomArrayElementAndRemove,
  log,
  range,
  removeCollectibleCostume,
  smeltTrinket,
} from "isaacscript-common";
import g from "../../../../globals";
import { initGlowingItemSprite, initSprite } from "../../../../sprite";
import { CollectibleTypeCustom } from "../../../../types/CollectibleTypeCustom";
import { giveCollectibleAndRemoveFromPools } from "../../../../utilGlobals";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../../util/restartOnNextFrame";
import { ChallengeCustom } from "../../enums";
import { speedrunGetCharacterNum, speedrunSetFastReset } from "../../exported";
import { getCharacterOrderSafe } from "../../speedrun";
import {
  SEASON_2_CHARACTERS,
  SEASON_2_FORGOTTEN_EXCEPTIONS,
  SEASON_2_LOCK_MILLISECONDS,
  SEASON_2_STARTING_BUILDS,
} from "../constants";
import sprites, { resetSprites } from "../sprites";
import v, {
  getTimeGameOpened,
  season2GetCurrentBuildIndex,
  season2GetCurrentCharacter,
} from "../v";

const GFX_PATH = "gfx/race/starting-room";
const NUM_REVELATION_SOUL_HEARTS = 4;

export function season2PostGameStarted(): void {
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
    speedrunSetFastReset();
    restartOnNextFrame();
    setRestartCharacter(startingCharacter);
    log(
      `Restarting because we are on character ${character} and we need to be on character ${startingCharacter} (for season 2).`,
    );
    return;
  }

  const startingBuild = SEASON_2_STARTING_BUILDS[startingBuildIndex];
  if (startingBuild === undefined) {
    error(`Failed to get the starting build for index: ${startingBuildIndex}`);
  }

  giveStartingItems(player, startingBuild);
  resetSprites();
  initSprites(startingBuild);
}

function checkErrors() {
  const time = Isaac.GetTime();

  // Game recently opened
  const timeGameOpened = getTimeGameOpened();
  const gameUnlockTime = timeGameOpened + SEASON_2_LOCK_MILLISECONDS;
  v.run.errors.gameRecentlyOpened = time <= gameUnlockTime;

  return v.run.errors.gameRecentlyOpened;
}

function removeItemsFromPools() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOL);
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);

  if (character === PlayerType.PLAYER_BLACKJUDAS) {
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_JUDAS_SHADOW);
  }
}

function checkFirstCharacterRefresh() {
  const characterNum = speedrunGetCharacterNum();
  if (characterNum !== 1) {
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
  const time = Isaac.GetTime();

  arrayEmpty(v.persistent.selectedCharacters);
  v.persistent.remainingCharacters = arrayCopy(SEASON_2_CHARACTERS);

  arrayEmpty(v.persistent.selectedBuildIndexes);
  arrayEmpty(v.persistent.remainingBuildIndexes);
  const buildIndexes = range(0, SEASON_2_STARTING_BUILDS.length - 1);
  v.persistent.remainingBuildIndexes.push(...buildIndexes);

  // We will assign the character and the build in the next function
  v.persistent.timeAssigned = time;

  log("Season 2 - Refreshed starting characters and builds.");
}

function getStartingCharacter() {
  // First, handle the case where there is no old starting character at all
  const oldStartingCharacter = season2GetCurrentCharacter();
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

  log(`Season 2 - Selected character: ${startingCharacter}`);

  return startingCharacter;
}

function getStartingBuildIndex(character: PlayerType) {
  // First, handle the case where there is no old starting build at all
  const oldStartingBuildIndex = season2GetCurrentBuildIndex();
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
  const antiSynergyBuilds = getAntiSynergyBuilds(character);
  buildExceptions.push(...antiSynergyBuilds);

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

function getAntiSynergyBuilds(character: PlayerType): int[] {
  switch (character) {
    // 5
    case PlayerType.PLAYER_EVE: {
      return getBuildIndexesFor(CollectibleType.COLLECTIBLE_CROWN_OF_LIGHT);
    }

    // 16
    case PlayerType.PLAYER_THEFORGOTTEN: {
      return SEASON_2_FORGOTTEN_EXCEPTIONS;
    }

    // 28
    case PlayerType.PLAYER_AZAZEL_B: {
      return getBuildIndexesFor(
        CollectibleType.COLLECTIBLE_DR_FETUS, // 52
        CollectibleType.COLLECTIBLE_CRICKETS_BODY, // 224
        CollectibleType.COLLECTIBLE_DEATHS_TOUCH, // 237
        CollectibleType.COLLECTIBLE_FIRE_MIND, // 257
        CollectibleType.COLLECTIBLE_DEAD_EYE, // 373
        CollectibleType.COLLECTIBLE_TECH_X, // 395
        CollectibleType.COLLECTIBLE_HAEMOLACRIA, // 531
      );
    }

    default: {
      return [];
    }
  }
}

function getBuildIndexesFor(...collectibleTypes: CollectibleType[]) {
  return collectibleTypes.map((collectibleType) =>
    getBuildIndexFor(collectibleType),
  );
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

function giveStartingItems(
  player: EntityPlayer,
  startingBuild: Array<CollectibleType | CollectibleTypeCustom>,
) {
  const character = player.GetPlayerType();

  // Everyone starts with the Compass in this season
  giveCollectibleAndRemoveFromPools(
    player,
    CollectibleType.COLLECTIBLE_COMPASS,
  );

  if (character === PlayerType.PLAYER_ISAAC_B) {
    giveCollectibleAndRemoveFromPools(
      player,
      CollectibleType.COLLECTIBLE_BIRTHRIGHT,
    );
  }

  for (const collectibleType of startingBuild) {
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }

  const firstCollectibleType = startingBuild[0];

  // Handle builds with smelted trinkets
  if (firstCollectibleType === CollectibleType.COLLECTIBLE_INCUBUS) {
    smeltTrinket(player, TrinketType.TRINKET_FORGOTTEN_LULLABY);
  }

  // Handle builds with custom nerfs
  if (firstCollectibleType === CollectibleType.COLLECTIBLE_REVELATION) {
    player.AddSoulHearts(NUM_REVELATION_SOUL_HEARTS * -1);
    removeCollectibleCostume(player, CollectibleType.COLLECTIBLE_REVELATION);
  }
}

function initSprites(
  startingBuild: Array<CollectibleType | CollectibleTypeCustom>,
) {
  sprites.characterTitle = initSprite(`${GFX_PATH}/character.anm2`);

  const title = startingBuild.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = initSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  if (startingBuild.length === 1) {
    sprites.seededItemCenter = initGlowingItemSprite(
      startingBuild[0] as CollectibleType,
    );
  } else if (startingBuild.length === 2) {
    sprites.seededItemLeft = initGlowingItemSprite(
      startingBuild[0] as CollectibleType,
    );
    sprites.seededItemRight = initGlowingItemSprite(
      startingBuild[1] as CollectibleType,
    );
  } else if (startingBuild.length === 3) {
    sprites.seededItemCenter = initGlowingItemSprite(
      startingBuild[0] as CollectibleType,
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      startingBuild[1] as CollectibleType,
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      startingBuild[2] as CollectibleType,
    );
  } else if (startingBuild.length === 4) {
    sprites.seededItemLeft = initGlowingItemSprite(
      startingBuild[1] as CollectibleType,
    );
    sprites.seededItemRight = initGlowingItemSprite(
      startingBuild[2] as CollectibleType,
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      startingBuild[0] as CollectibleType,
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      startingBuild[3] as CollectibleType,
    );
  }
}
