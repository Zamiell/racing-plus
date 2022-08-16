import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  copyArray,
  getRandomArrayElement,
  getRandomArrayElementAndRemove,
  newRNG,
  repeat,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { addCollectibleAndRemoveFromPools } from "../../../../utilsGlobals";
import { giveDiversityItemsAndDoItemBans } from "../../../race/formatSetup";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../../utils/restartOnNextFrame";
import { getTimeConsoleUsed } from "../../../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../utils/timeGameOpened";
import { speedrunGetCharacterNum, speedrunSetFastReset } from "../../exported";
import { resetPersistentVars } from "../../v";
import {
  BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY,
  DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
  DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
  DIVERSITY_TRINKET_TYPES,
  NUM_DIVERSITY_PASSIVE_COLLECTIBLES,
  SEASON_3_CHARACTERS,
  SEASON_3_GOALS,
  SEASON_3_LOCK_MILLISECONDS,
} from "../constants";
import { initSeason3StartingRoomSprites } from "../startingRoomSprites";
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

  checkFirstCharacterRefresh();

  const startingCharacter = getStartingCharacter();
  if (character !== startingCharacter) {
    speedrunSetFastReset();
    restartOnNextFrame();
    setRestartCharacter(startingCharacter);
    return;
  }

  giveStartingItems(player);
  removeItemsFromPools();

  const [collectibleTypes, trinketType] = getRandomDiversityItems(player);
  giveDiversityItemsAndDoItemBans(player, collectibleTypes, trinketType);

  initSeason3StartingRoomSprites(collectibleTypes, trinketType);
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

  refreshStartingCharactersAndGoals();
}

function getRandomDiversityItems(
  player: EntityPlayer,
): [collectibleTypes: CollectibleType[], trinketType: TrinketType] {
  const startSeed = g.seeds.GetStartSeed();
  const rng = newRNG(startSeed);

  let activeCollectibleType: CollectibleType;
  do {
    activeCollectibleType = getRandomArrayElement(
      DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
      rng,
    );
  } while (player.HasCollectible(activeCollectibleType));

  const passiveCollectibleTypes: CollectibleType[] = [];
  repeat(NUM_DIVERSITY_PASSIVE_COLLECTIBLES, () => {
    let passiveCollectibleType: CollectibleType;
    do {
      passiveCollectibleType = getRandomArrayElement(
        DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
        rng,
        passiveCollectibleTypes,
      );
    } while (player.HasCollectible(passiveCollectibleType));
    passiveCollectibleTypes.push(passiveCollectibleType);
  });

  let trinketType: TrinketType;
  do {
    trinketType = getRandomArrayElement(DIVERSITY_TRINKET_TYPES, rng);
  } while (player.HasTrinket(trinketType));

  const collectibleTypes = [activeCollectibleType, ...passiveCollectibleTypes];

  return [collectibleTypes, trinketType];
}

/** In addition to the "normal" diversity bans, some additional items are removed from pools. */
function removeItemsFromPools() {
  for (const collectibleType of BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY) {
    g.itemPool.RemoveCollectible(collectibleType);
  }
}

function refreshStartingCharactersAndGoals() {
  const time = Isaac.GetTime();

  v.persistent.selectedCharacters = [];
  v.persistent.remainingCharacters = copyArray(SEASON_3_CHARACTERS);

  v.persistent.remainingGoals = copyArray(SEASON_3_GOALS);

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
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    // 22
    case PlayerType.MAGDALENE_B: {
      // Birthright should come before Steven on the item tracker.
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      addCollectibleAndRemoveFromPools(player, CollectibleType.STEVEN);
      break;
    }

    // 24
    case PlayerType.JUDAS_B: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    // 26
    case PlayerType.EVE_B: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    default: {
      break;
    }
  }
}
