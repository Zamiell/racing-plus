import {
  arrayCopy,
  arrayEmpty,
  getDefaultKColor,
  getPlayerName,
  getRandomArrayElementAndRemove,
  log,
  range,
  smeltTrinket,
} from "isaacscript-common";
import g from "../../globals";
import { initGlowingItemSprite, initSprite } from "../../sprite";
import { CollectibleTypeCustom } from "../../types/CollectibleTypeCustom";
import { giveCollectibleAndRemoveFromPools } from "../../utilGlobals";
import { drawErrorText } from "../mandatory/errors";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../util/restartOnNextFrame";
import { getRoomsEntered } from "../util/roomsEntered";
import { ChallengeCustom } from "./enums";
import {
  SEASON_2_CHARACTERS,
  SEASON_2_FORGOTTEN_EXCEPTIONS,
  SEASON_2_LOCK_MILLISECONDS,
  SEASON_2_STARTING_BUILDS,
} from "./season2constants";
import { getCharacterOrderSafe } from "./speedrun";
import v from "./v";

const TOP_LEFT_GRID_INDEX = 32;
const TOP_RIGHT_GRID_INDEX = 42;
const GFX_PATH = "gfx/race/starting-room";
const SPRITE_TITLE_OFFSET = Vector(0, -30);
const SPRITE_ITEM_OFFSET = 15;

const timeGameOpened = Isaac.GetTime();

const sprites: Record<string, Sprite | null> = {
  characterTitle: null,

  seededStartingTitle: null, // "Starting Item" or "Starting Build"
  seededItemCenter: null,
  seededItemLeft: null,
  seededItemRight: null,
  seededItemFarLeft: null,
  seededItemFarRight: null,
};

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  if (drawErrors()) {
    return;
  }

  drawStartingRoomSprites();
  drawStartingRoomText();
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

function drawStartingRoomSprites() {
  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName);
      sprite.RenderLayer(0, position);
    }
  }
}

function drawStartingRoomText() {
  const roomsEntered = getRoomsEntered();

  if (roomsEntered !== 1) {
    return;
  }

  const player = Isaac.GetPlayer();
  const characterName = getPlayerName(player);

  const positionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  let position = Isaac.WorldToRenderPosition(positionGame);
  position = position.add(Vector(0, -11));

  const font = g.fonts.droid;
  const length = font.GetStringWidthUTF8(characterName);

  font.DrawString(
    characterName,
    position.X - length / 2,
    position.Y,
    getDefaultKColor(),
  );
}

function getPosition(spriteName: keyof typeof sprites) {
  const topLeftPositionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const topLeftPosition = Isaac.WorldToRenderPosition(topLeftPositionGame);
  const topRightPositionGame = g.r.GetGridPosition(TOP_RIGHT_GRID_INDEX);
  const topRightPosition = Isaac.WorldToRenderPosition(topRightPositionGame);

  switch (spriteName) {
    case "characterTitle": {
      return topLeftPosition.add(SPRITE_TITLE_OFFSET);
    }

    case "seededStartingTitle": {
      return topRightPosition.add(SPRITE_TITLE_OFFSET);
    }

    case "seededItemCenter": {
      return topRightPosition;
    }

    case "seededItemLeft": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * -1, 0));
    }

    case "seededItemRight": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET, 0));
    }

    case "seededItemFarLeft": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * -3, 0));
    }

    case "seededItemFarRight": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * 3, 0));
    }

    default: {
      return error(
        `Starting room sprites named "${spriteName}" are unsupported.`,
      );
    }
  }
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
  const gameUnlockTime = timeGameOpened + SEASON_2_LOCK_MILLISECONDS;
  v.run.errors.gameRecentlyOpened = time <= gameUnlockTime;

  return v.run.errors.gameRecentlyOpened;
}

function removeItemsFromPools() {
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SOL);
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_CAINS_EYE);
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
  const oldStartingCharacter =
    v.persistent.selectedCharacters[v.persistent.characterNum - 1];
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
  const oldStartingBuildIndex =
    v.persistent.selectedBuildIndexes[v.persistent.characterNum - 1];
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
        CollectibleType.COLLECTIBLE_CRICKETS_BODY,
        CollectibleType.COLLECTIBLE_DEAD_EYE,
        CollectibleType.COLLECTIBLE_FIRE_MIND,
        CollectibleType.COLLECTIBLE_EYE_OF_THE_OCCULT,
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

  // Handle builds with smelted trinkets
  const firstCollectibleType = startingBuild[0];
  if (firstCollectibleType === CollectibleType.COLLECTIBLE_INCUBUS) {
    smeltTrinket(player, TrinketType.TRINKET_FORGOTTEN_LULLABY);
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

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const roomsEntered = getRoomsEntered();

  if (roomsEntered !== 1) {
    resetSprites();
  }
}

function resetSprites() {
  for (const key of Object.keys(sprites)) {
    const property = key;
    sprites[property] = null;
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
