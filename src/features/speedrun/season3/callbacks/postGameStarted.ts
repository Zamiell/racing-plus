import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  copyArray,
  emptyArray,
  getRandomArrayElementAndRemove,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { giveDiversityItemsAndDoItemBans } from "../../../race/formatSetup";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../../utils/restartOnNextFrame";
import { getTimeConsoleUsed } from "../../../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../utils/timeGameOpened";
import { speedrunGetCharacterNum, speedrunSetFastReset } from "../../exported";
import { resetPersistentVars } from "../../v";
import { SEASON_3_CHARACTERS, SEASON_3_LOCK_MILLISECONDS } from "../constants";
import v, { season3GetCurrentCharacter } from "../v";

export function season3PostGameStarted(): void {
  const challenge = Isaac.GetChallenge();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (checkErrors()) {
    return;
  }

  removeItemsFromPools();
  checkFirstCharacterRefresh();

  const startingCharacter = getStartingCharacter();
  if (character !== startingCharacter) {
    speedrunSetFastReset();
    restartOnNextFrame();
    setRestartCharacter(startingCharacter);
    return;
  }

  giveStartingItems(player);

  // TODO: pick items
  giveDiversityItemsAndDoItemBans(
    player,
    [] as CollectibleType[],
    TrinketType.SWALLOWED_PENNY,
  );

  /*
  resetSprites();
  initSprites(startingBuild);
  */
}

function checkErrors(): boolean {
  const time = Isaac.GetTime();

  // Game recently opened.
  const timeGameOpened = getTimeGameOpened();
  const gameUnlockTime = timeGameOpened + SEASON_3_LOCK_MILLISECONDS;
  v.run.errors.gameRecentlyOpened = time <= gameUnlockTime;

  // Console recently used.
  const timeConsoleUsed = getTimeConsoleUsed();
  if (timeConsoleUsed === null) {
    v.run.errors.consoleRecentlyUsed = false;
  } else {
    const consoleUnlockTime = timeConsoleUsed + SEASON_3_LOCK_MILLISECONDS;
    v.run.errors.consoleRecentlyUsed = time <= consoleUnlockTime;

    // Force them back on the first character if they used the console.
    if (v.run.errors.consoleRecentlyUsed) {
      resetPersistentVars();
    }
  }

  return v.run.errors.gameRecentlyOpened;
}

/** In addition to the "normal" diversity bans, some additional items are removed from pools. */
function removeItemsFromPools() {
  // These bans are copied from R+7 Season 6 for Afterbirth+. (They were originally Dea1h's idea.)
  g.itemPool.RemoveCollectible(CollectibleType.WE_NEED_TO_GO_DEEPER);
  g.itemPool.RemoveCollectible(CollectibleType.MEGA_BLAST);
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
  }

  const buildLockedUntilTime =
    v.persistent.timeAssigned + SEASON_3_LOCK_MILLISECONDS;
  if (
    time <= buildLockedUntilTime &&
    v.persistent.selectedCharacters.length > 0
  ) {
    return;
  }

  refreshStartingCharacters();
}

function refreshStartingCharacters() {
  const time = Isaac.GetTime();

  emptyArray(v.persistent.selectedCharacters);
  v.persistent.remainingCharacters = copyArray(SEASON_3_CHARACTERS);

  // We will assign the character in the next function.
  v.persistent.timeAssigned = time;
}

function getStartingCharacter() {
  // First, handle the case where there is no old starting character at all.
  const oldStartingCharacter = season3GetCurrentCharacter();
  if (oldStartingCharacter !== undefined) {
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

  return startingCharacter;
}

function giveStartingItems(player: EntityPlayer) {
  const character = player.GetPlayerType();

  switch (character) {
    // 4
    case PlayerType.BLUE_BABY: {
      player.AddCollectible(CollectibleType.BIRTHRIGHT);
      break;
    }

    // 22
    case PlayerType.MAGDALENE_B: {
      player.AddCollectible(CollectibleType.BIRTHRIGHT);
      break;
    }

    // 24
    case PlayerType.JUDAS_B: {
      player.AddCollectible(CollectibleType.BIRTHRIGHT);
      break;
    }

    // 26
    case PlayerType.EVE_B: {
      player.AddCollectible(CollectibleType.BIRTHRIGHT);
      break;
    }

    default: {
      break;
    }
  }
}
