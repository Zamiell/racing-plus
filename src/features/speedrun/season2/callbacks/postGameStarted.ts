import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  copyArray,
  emptyArray,
  getRandomArrayElementAndRemove,
  log,
  removeCollectibleCostume,
  smeltTrinket,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import g from "../../../../globals";
import { initGlowingItemSprite, initSprite } from "../../../../sprite";
import {
  giveCollectibleAndRemoveFromPools,
  giveTrinketAndRemoveFromPools,
} from "../../../../utilsGlobals";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../../utils/restartOnNextFrame";
import { getTimeConsoleUsed } from "../../../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../utils/timeGameOpened";
import { speedrunGetCharacterNum, speedrunSetFastReset } from "../../exported";
import { getCharacterOrderSafe } from "../../speedrun";
import { resetPersistentVars } from "../../v";
import {
  SEASON_2_CHARACTERS,
  SEASON_2_FORGOTTEN_EXCEPTIONS,
  SEASON_2_LOCK_MILLISECONDS,
  SEASON_2_STARTING_BUILDS,
  SEASON_2_STARTING_BUILD_INDEXES,
} from "../constants";
import sprites, { resetSprites } from "../sprites";
import v, {
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

  log(`Season 2 - On character: ${speedrunGetCharacterNum()}/7`);
  const startingCharacter = getStartingCharacter();
  const startingBuildIndex = getStartingBuildIndex(startingCharacter);

  if (character !== startingCharacter) {
    speedrunSetFastReset();
    restartOnNextFrame();
    setRestartCharacter(startingCharacter);
    log(
      `Restarting because we are on character ${PlayerType[character]} (${character}) and we need to be on character ${PlayerType[startingCharacter]} (${startingCharacter}) (for season 2).`,
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

  // Game recently opened.
  const timeGameOpened = getTimeGameOpened();
  const gameUnlockTime = timeGameOpened + SEASON_2_LOCK_MILLISECONDS;
  v.run.errors.gameRecentlyOpened = time <= gameUnlockTime;

  // Console recently used.
  const timeConsoleUsed = getTimeConsoleUsed();
  if (timeConsoleUsed === null) {
    v.run.errors.consoleRecentlyUsed = false;
  } else {
    const consoleUnlockTime = timeConsoleUsed + SEASON_2_LOCK_MILLISECONDS;
    v.run.errors.consoleRecentlyUsed = time <= consoleUnlockTime;

    // Force them back on the first character if they used the console.
    if (v.run.errors.consoleRecentlyUsed) {
      resetPersistentVars();
    }
  }

  // Bans recently assigned.
  if (v.persistent.timeBansSet === null) {
    v.run.errors.bansRecentlySet = false;
  } else {
    const bansUnlockTime =
      v.persistent.timeBansSet + SEASON_2_LOCK_MILLISECONDS;
    v.run.errors.bansRecentlySet = time <= bansUnlockTime;
  }

  return v.run.errors.gameRecentlyOpened || v.run.errors.bansRecentlySet;
}

function removeItemsFromPools() {
  // These bans are from seeded races.
  g.itemPool.RemoveCollectible(CollectibleType.SOL);
  g.itemPool.RemoveTrinket(TrinketType.CAINS_EYE);

  if (anyPlayerIs(PlayerType.BLACK_JUDAS)) {
    g.itemPool.RemoveCollectible(CollectibleType.JUDAS_SHADOW);
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
    // since the operating system started.
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

  emptyArray(v.persistent.selectedCharacters);
  v.persistent.remainingCharacters = copyArray(SEASON_2_CHARACTERS);

  emptyArray(v.persistent.selectedBuildIndexes);
  emptyArray(v.persistent.remainingBuildIndexes);
  v.persistent.remainingBuildIndexes.push(...SEASON_2_STARTING_BUILD_INDEXES);

  // We will assign the character and the build in the next function.
  v.persistent.timeAssigned = time;

  log("Season 2 - Refreshed starting characters and builds.");
}

function getStartingCharacter() {
  // First, handle the case where there is no old starting character at all.
  const oldStartingCharacter = season2GetCurrentCharacter();
  if (oldStartingCharacter !== undefined) {
    log(
      `Season 2 - Using previously selected character: ${PlayerType[oldStartingCharacter]} (${oldStartingCharacter})`,
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

  log(
    `Season 2 - Selected character: ${PlayerType[startingCharacter]} (${startingCharacter})`,
  );

  return startingCharacter;
}

function getStartingBuildIndex(character: PlayerType) {
  // First, handle the case where there is no old starting build at all.
  const oldStartingBuildIndex = season2GetCurrentBuildIndex();
  if (oldStartingBuildIndex !== undefined) {
    log(`Season 2 - Using previously selected build: ${oldStartingBuildIndex}`);
    return oldStartingBuildIndex;
  }

  const buildExceptions: int[] = [];

  // Don't get the same starting build as the one we just played.
  if (v.persistent.lastSelectedBuildIndex !== null) {
    buildExceptions.push(v.persistent.lastSelectedBuildIndex);
  }

  // Don't get starting builds that we have vetoed.
  const vetoedBuilds = getCharacterOrderSafe();
  buildExceptions.push(...vetoedBuilds);

  // Don't get starting builds that don't synergize with the current character.
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

function getAntiSynergyBuilds(character: PlayerType): readonly int[] {
  switch (character) {
    // 5
    case PlayerType.EVE: {
      return getBuildIndexesFor(CollectibleType.CROWN_OF_LIGHT);
    }

    // 16
    case PlayerType.THE_FORGOTTEN: {
      return SEASON_2_FORGOTTEN_EXCEPTIONS;
    }

    // 27
    case PlayerType.SAMSON_B: {
      return getBuildIndexesFor(
        CollectibleType.DR_FETUS, // 52
        CollectibleType.BRIMSTONE, // 118
        CollectibleType.IPECAC, // 148
        CollectibleType.FIRE_MIND, // 257
      );
    }

    // 28
    case PlayerType.AZAZEL_B: {
      return getBuildIndexesFor(
        CollectibleType.DR_FETUS, // 52
        CollectibleType.CRICKETS_BODY, // 224
        CollectibleType.DEATHS_TOUCH, // 237
        CollectibleType.FIRE_MIND, // 257
        CollectibleType.DEAD_EYE, // 373
        CollectibleType.TECH_X, // 395
        CollectibleType.HAEMOLACRIA, // 531
        CollectibleType.POINTY_RIB, // 544
        CollectibleType.REVELATION, // 643
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
    if (build === undefined) {
      continue;
    }

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
  startingBuild: readonly CollectibleType[],
) {
  const character = player.GetPlayerType();

  // Everyone starts with the Compass in this season.
  giveCollectibleAndRemoveFromPools(player, CollectibleType.COMPASS);

  switch (character) {
    // 2
    case PlayerType.CAIN: {
      // Cain does not automatically start with the Paper Clip in custom challenges.
      giveTrinketAndRemoveFromPools(player, TrinketType.PAPER_CLIP);
      break;
    }

    // 5
    case PlayerType.EVE: {
      // Eve does not automatically start with the Razor in custom challenges.
      giveCollectibleAndRemoveFromPools(player, CollectibleType.RAZOR_BLADE);
      break;
    }

    case PlayerType.ISAAC_B: {
      giveCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    default: {
      break;
    }
  }

  for (const collectibleType of startingBuild) {
    giveCollectibleAndRemoveFromPools(player, collectibleType);
  }

  const firstCollectibleType = startingBuild[0];

  // Handle builds with smelted trinkets.
  if (firstCollectibleType === CollectibleType.INCUBUS) {
    smeltTrinket(player, TrinketType.FORGOTTEN_LULLABY);
  }

  // Handle builds with custom nerfs.
  if (firstCollectibleType === CollectibleType.REVELATION) {
    player.AddSoulHearts(NUM_REVELATION_SOUL_HEARTS * -1);
    removeCollectibleCostume(player, CollectibleType.REVELATION);
  } else if (firstCollectibleType === CollectibleTypeCustom.SAWBLADE) {
    player.AddEternalHearts(-1);
  }
}

function initSprites(startingBuild: readonly CollectibleType[]) {
  sprites.characterTitle = initSprite(`${GFX_PATH}/character.anm2`);

  const title = startingBuild.length === 1 ? "item" : "build";
  sprites.seededStartingTitle = initSprite(
    `${GFX_PATH}/seeded-starting-${title}.anm2`,
  );

  if (startingBuild.length === 1) {
    sprites.seededItemCenter = initGlowingItemSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 2) {
    sprites.seededItemLeft = initGlowingItemSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemRight = initGlowingItemSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 3) {
    sprites.seededItemCenter = initGlowingItemSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      startingBuild[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  } else if (startingBuild.length === 4) {
    sprites.seededItemLeft = initGlowingItemSprite(
      startingBuild[1]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemRight = initGlowingItemSprite(
      startingBuild[2]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarLeft = initGlowingItemSprite(
      startingBuild[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
    sprites.seededItemFarRight = initGlowingItemSprite(
      startingBuild[3]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    );
  }
}
