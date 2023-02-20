import {
  Challenge,
  LevelStage,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  copyArray,
  game,
  getEffectiveStage,
  getRandomArrayElementAndRemove,
  isRoomInsideGrid,
  ReadonlySet,
  removeAllDoors,
} from "isaacscript-common";
import { STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND } from "../../classes/features/speedrun/Season4";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { g } from "../../globals";
import { hotkeys } from "../../modConfigMenu";
import { drawErrorText, hasErrors } from "../mandatory/errors";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../utils/restartOnNextFrame";
import { getTimeConsoleUsed } from "../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../utils/timeGameOpened";
import {
  RANDOM_CHARACTER_LOCK_MILLISECONDS,
  RANDOM_CHARACTER_LOCK_SECONDS,
} from "./constants";
import { SEASON_2_NUM_BANS } from "./season2/constants";
import { season2ResetBuilds } from "./season2/v";
import {
  speedrunGetCharacterNum,
  speedrunGetCurrentSelectedCharacter,
  speedrunHasErrors,
  speedrunResetPersistentVars,
  speedrunSetFastReset,
  v,
} from "./v";

const CHALLENGES_WITH_RANDOM_CHARACTER_ORDER = [
  ChallengeCustom.SEASON_2,
  ChallengeCustom.SEASON_3,
  ChallengeCustom.SEASON_4,
] as const;

const CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET = new ReadonlySet<Challenge>(
  CHALLENGES_WITH_RANDOM_CHARACTER_ORDER,
);

const STARTING_CHARACTERS = {
  [ChallengeCustom.SEASON_2]: [
    PlayerType.CAIN, // 2
    PlayerType.EVE, // 5
    PlayerType.DARK_JUDAS, // 12
    PlayerType.FORGOTTEN, // 16
    PlayerType.ISAAC_B, // 21
    PlayerType.SAMSON_B, // 27
    PlayerType.AZAZEL_B, // 28
  ],

  [ChallengeCustom.SEASON_3]: [
    PlayerType.JUDAS, // 3
    PlayerType.BLUE_BABY, // 4
    PlayerType.SAMSON, // 6
    PlayerType.LAZARUS, // 8
    PlayerType.JUDAS_B, // 24
    PlayerType.EVE_B, // 26
    PlayerType.JACOB_B, // 37
  ],

  [ChallengeCustom.SEASON_4]: [
    PlayerType.ISAAC, // 0
    PlayerType.JUDAS, // 3
    PlayerType.AZAZEL, // 7
    PlayerType.LILITH, // 13
    PlayerType.APOLLYON, // 15
    PlayerType.BETHANY, // 18
    PlayerType.JACOB, // 19
  ],
} as const;

for (const season of CHALLENGES_WITH_RANDOM_CHARACTER_ORDER) {
  const characters = STARTING_CHARACTERS[season];
  if (characters === undefined) {
    error(
      `Failed to get the starting characters for custom challenge: ${season}`,
    );
  }
}

export function isSpeedrunWithRandomCharacterOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  return CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET.has(challenge);
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  const hud = game.GetHUD();

  if (!isSpeedrunWithRandomCharacterOrder()) {
    return;
  }

  if (!hud.IsVisible()) {
    return;
  }

  // We don't want to display two errors at the same time.
  if (hasErrors()) {
    return;
  }

  // We do not have to check if the game is paused because the pause menu will be drawn on top of
  // the starting room sprites. (And we do not have to worry about the room slide animation because
  // the starting room sprites are not shown once we re-enter the room.)

  drawErrors();
}

function drawErrors() {
  let action: string | undefined;
  let errorEventTime: int | undefined;

  if (v.run.errors.hotkeyNotAssigned) {
    action = "hotkeyNotAssigned";
    errorEventTime = 0;
  } else if (v.run.errors.gameRecentlyOpened) {
    action = "opening the game";
    errorEventTime = getTimeGameOpened();
  } else if (v.run.errors.consoleRecentlyUsed) {
    action = "using the console";
    errorEventTime = getTimeConsoleUsed();
  } else if (v.run.errors.bansRecentlySet) {
    action = `assigning your ${SEASON_2_NUM_BANS} build bans`;
    errorEventTime = v.persistent.randomCharacterOrder.timeBansSet ?? undefined;
  }

  if (action === undefined || errorEventTime === undefined) {
    return;
  }

  const time = Isaac.GetTime();
  const endTime = errorEventTime + RANDOM_CHARACTER_LOCK_MILLISECONDS;
  const millisecondsRemaining = endTime - time;
  const secondsRemaining = Math.ceil(millisecondsRemaining / 1000);
  const text = getErrorMessage(action, secondsRemaining);
  drawErrorText(text);
}

function getErrorMessage(action: string, secondsRemaining: int) {
  if (action === "hotkeyNotAssigned") {
    return "You must set a hotkey to store items using Mod Config Menu. (Restart the game after this is done.)";
  }

  if (secondsRemaining > RANDOM_CHARACTER_LOCK_SECONDS) {
    return 'Please set your item vetos for Season 2 again in the "Change Char Order" custom challenge.';
  }

  const suffix = secondsRemaining > 1 ? "s" : "";
  const secondsRemainingText = `${secondsRemaining} second${suffix}`;
  const secondSentence =
    secondsRemaining > 0
      ? `Please wait ${secondsRemainingText} and then restart.`
      : "Please restart.";
  return `You are not allowed to start a new run so soon after ${action}. ${secondSentence}`;
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!isSpeedrunWithRandomCharacterOrder()) {
    return;
  }

  checkErrors();
  if (speedrunHasErrors()) {
    removeAllDoors();
    return;
  }

  checkFirstCharacterRefresh();

  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const startingCharacter = getStartingCharacter();
  if (character !== startingCharacter) {
    speedrunSetFastReset();
    restartOnNextFrame();
    setRestartCharacter(startingCharacter);
  }
}

/** The errors set in this function must correspond to the `v.run.errors` object. */
function checkErrors() {
  const time = Isaac.GetTime();

  // Hotkeys
  v.run.errors.hotkeyNotAssigned = hotkeys.storage === -1;

  // Game recently opened.
  const timeGameOpened = getTimeGameOpened();
  const gameUnlockTime = timeGameOpened + RANDOM_CHARACTER_LOCK_MILLISECONDS;
  v.run.errors.gameRecentlyOpened = time <= gameUnlockTime;

  // Console recently used.
  const timeConsoleUsed = getTimeConsoleUsed();
  if (timeConsoleUsed === undefined) {
    v.run.errors.consoleRecentlyUsed = false;
  } else {
    const consoleUnlockTime =
      timeConsoleUsed + RANDOM_CHARACTER_LOCK_MILLISECONDS;
    v.run.errors.consoleRecentlyUsed = time <= consoleUnlockTime;
  }

  // Force them back on the first character if they used the console.
  if (v.run.errors.consoleRecentlyUsed) {
    speedrunResetPersistentVars();
  }

  // Bans recently assigned.
  if (v.persistent.randomCharacterOrder.timeBansSet === null) {
    v.run.errors.bansRecentlySet = false;
  } else {
    const bansUnlockTime =
      v.persistent.randomCharacterOrder.timeBansSet +
      RANDOM_CHARACTER_LOCK_MILLISECONDS;
    v.run.errors.bansRecentlySet = time <= bansUnlockTime;
  }
}

function checkFirstCharacterRefresh() {
  const characterNum = speedrunGetCharacterNum();
  if (characterNum !== 1) {
    return;
  }

  const time = Isaac.GetTime();
  if (
    v.persistent.randomCharacterOrder.timeCharacterAssigned === null ||
    v.persistent.randomCharacterOrder.timeCharacterAssigned > time
  ) {
    // It is possible for the time assignment to be in the future, since it is based on the time
    // since the operating system started.
    v.persistent.randomCharacterOrder.timeCharacterAssigned = time;
  }

  const buildLockedUntilTime =
    v.persistent.randomCharacterOrder.timeCharacterAssigned +
    RANDOM_CHARACTER_LOCK_MILLISECONDS;
  if (
    time > buildLockedUntilTime ||
    v.persistent.randomCharacterOrder.selectedCharacters.length === 0
  ) {
    refreshStartingCharactersAndOtherThings();
  }
}

function refreshStartingCharactersAndOtherThings() {
  const challenge = Isaac.GetChallenge();
  const time = Isaac.GetTime();
  const characters = STARTING_CHARACTERS[challenge];
  if (characters === undefined) {
    error(
      `Failed to get the starting characters for custom challenge: ${challenge}`,
    );
  }

  v.persistent.randomCharacterOrder.selectedCharacters = [];
  v.persistent.randomCharacterOrder.remainingCharacters = copyArray(characters);
  v.persistent.randomCharacterOrder.timeCharacterAssigned = time; // We will assign the character in the next function.

  switch (challenge) {
    case ChallengeCustom.SEASON_2: {
      season2ResetBuilds();
      break;
    }

    default: {
      break;
    }
  }
}

export function getStartingCharacter(): PlayerType {
  const challenge = Isaac.GetChallenge();

  // First, handle the case where we have already selected a starting character.
  const oldStartingCharacter = speedrunGetCurrentSelectedCharacter();
  if (oldStartingCharacter !== undefined) {
    return oldStartingCharacter;
  }

  // Prepare a list of characters that should not be possible for this segment of the speedrun.
  const characterExceptions =
    v.persistent.randomCharacterOrder.lastSelectedCharacter === null
      ? []
      : [v.persistent.randomCharacterOrder.lastSelectedCharacter];
  if (challenge === ChallengeCustom.SEASON_4) {
    const characterNum = speedrunGetCharacterNum();
    if (characterNum <= 2) {
      for (const character of STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND) {
        if (!characterExceptions.includes(character)) {
          characterExceptions.push(character);
        }
      }
    }
  }

  // Select a new starting character.
  const startingCharacter = getRandomArrayElementAndRemove(
    v.persistent.randomCharacterOrder.remainingCharacters,
    undefined,
    characterExceptions,
  );

  v.persistent.randomCharacterOrder.selectedCharacters.push(startingCharacter);
  v.persistent.randomCharacterOrder.lastSelectedCharacter = startingCharacter;

  return startingCharacter;
}

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function preSpawnClearAward(): void {
  if (!isSpeedrunWithRandomCharacterOrder()) {
    return;
  }

  checkResetTimeAssigned();
}

/** Reset the starting character timer if we just killed the Basement 2 boss. */
function checkResetTimeAssigned() {
  const roomType = g.r.GetType();
  const effectiveStage = getEffectiveStage();
  const roomInsideGrid = isRoomInsideGrid();

  if (
    effectiveStage === LevelStage.BASEMENT_2 &&
    roomType === RoomType.BOSS &&
    roomInsideGrid
  ) {
    v.persistent.randomCharacterOrder.timeCharacterAssigned = 0;
  }
}
