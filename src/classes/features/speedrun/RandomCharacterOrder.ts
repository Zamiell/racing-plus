import {
  Challenge,
  LevelStage,
  ModCallback,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import { CallbackPriority } from "isaac-typescript-definitions/dist/src/enums/CallbackPriority";
import {
  Callback,
  copyArray,
  emptyArray,
  game,
  getEffectiveStage,
  getRandomArrayElementAndRemove,
  isRoomInsideGrid,
  ModCallbackCustom,
  PriorityCallbackCustom,
  ReadonlySet,
  removeAllDoors,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { drawErrorText } from "../../../features/mandatory/errors/utils";
import { hasErrors } from "../../../features/mandatory/errors/v";
import {
  RANDOM_CHARACTER_LOCK_MILLISECONDS,
  RANDOM_CHARACTER_LOCK_SECONDS,
} from "../../../features/speedrun/constants";
import { SEASON_2_NUM_BANS } from "../../../features/speedrun/season2/constants";
import { season2ResetBuilds } from "../../../features/speedrun/season2/v";
import {
  speedrunGetCharacterNum,
  speedrunResetPersistentVarsSpeedrun,
  speedrunSetFastReset,
} from "../../../features/speedrun/v";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../../features/utils/restartOnNextFrame";
import { getTimeConsoleUsed } from "../../../features/utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../features/utils/timeGameOpened";
import { g } from "../../../globals";
import { hotkeys } from "../../../modConfigMenu";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { SEASON_4_STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND } from "./season4Constants";

const CHALLENGES_WITH_RANDOM_CHARACTER_ORDER = [
  ChallengeCustom.SEASON_2,
  ChallengeCustom.SEASON_3,
  ChallengeCustom.SEASON_4,
] as const;

const CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET = new ReadonlySet<Challenge>(
  CHALLENGES_WITH_RANDOM_CHARACTER_ORDER,
);

const SEASON_CHARACTERS = {
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

// This has to be checked at run-time because e.g. `ChallengeCustom.SEASON_2` is a dynamic value.
for (const season of CHALLENGES_WITH_RANDOM_CHARACTER_ORDER) {
  const characters = SEASON_CHARACTERS[season];
  if (characters === undefined) {
    error(
      `Failed to get the starting characters for custom challenge: ${season}`,
    );
  }
}

const v = {
  persistent: {
    selectedCharacters: [] as PlayerType[],
    remainingCharacters: [] as PlayerType[],

    /** Never start the same character twice in a row. */
    lastSelectedCharacter: null as PlayerType | null,

    /** This is set to 0 when the Basement 2 boss is defeated. */
    timeCharacterAssigned: null as int | null,

    /** The time that the bans were set in the "Change Char Order" custom challenge. */
    timeBansSet: null as int | null,
  },

  run: {
    errors: {
      // We put all speedrun errors here to avoid having two sets of text drawn at the same time.
      hotkeyNotAssigned: false,

      gameRecentlyOpened: false,
      consoleRecentlyUsed: false,
      bansRecentlySet: false,
    },
  },
};

export function isSpeedrunWithRandomCharacterOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  return CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET.has(challenge);
}

/** The errors set in this function must correspond to the `v.run.errors` object. */
export function speedrunHasErrors(): boolean {
  const errors = Object.values(v.run.errors);
  return errors.includes(true);
}

export function randomCharacterOrderResetPersistentVars(): void {
  emptyArray(v.persistent.selectedCharacters);
  emptyArray(v.persistent.remainingCharacters);
  v.persistent.lastSelectedCharacter = null;
  v.persistent.timeCharacterAssigned = null;
  // `timeBansSet` is not reset since it has to do with the Change Char Order challenge.
}

export function speedrunSetBansTime(): void {
  v.persistent.timeBansSet = Isaac.GetTime();
}

export class RandomCharacterOrder extends ChallengeModFeature {
  challenge = CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET;
  v = v;

  @Callback(ModCallback.POST_RENDER) // 2
  postRender(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // We don't want to display two errors at the same time.
    if (hasErrors()) {
      return;
    }

    // We do not have to check if the game is paused because the pause menu will be drawn on top of
    // the starting room sprites. (And we do not have to worry about the room slide animation
    // because the starting room sprites are not shown once we re-enter the room.)

    this.drawErrors();
  }

  drawErrors(): void {
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
      errorEventTime = v.persistent.timeBansSet ?? undefined;
    }

    if (action === undefined || errorEventTime === undefined) {
      return;
    }

    const time = Isaac.GetTime();
    const endTime = errorEventTime + RANDOM_CHARACTER_LOCK_MILLISECONDS;
    const millisecondsRemaining = endTime - time;
    const secondsRemaining = Math.ceil(millisecondsRemaining / 1000);
    const text = this.getErrorMessage(action, secondsRemaining);
    drawErrorText(text);
  }

  getErrorMessage(action: string, secondsRemaining: int): string {
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

  @PriorityCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    CallbackPriority.LATE, // TODO
    false,
  )
  postGameStartedReorderedFalse(): void {
    this.checkErrors();
    if (speedrunHasErrors()) {
      removeAllDoors();
      return;
    }

    this.checkFirstCharacterRefresh();

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
  checkErrors(): void {
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
      speedrunResetPersistentVarsSpeedrun();
      randomCharacterOrderResetPersistentVars();
    }

    // Bans recently assigned.
    if (v.persistent.timeBansSet === null) {
      v.run.errors.bansRecentlySet = false;
    } else {
      const bansUnlockTime =
        v.persistent.timeBansSet + RANDOM_CHARACTER_LOCK_MILLISECONDS;
      v.run.errors.bansRecentlySet = time <= bansUnlockTime;
    }
  }

  checkFirstCharacterRefresh(): void {
    const characterNum = speedrunGetCharacterNum();
    if (characterNum !== 1) {
      return;
    }

    const time = Isaac.GetTime();
    if (
      v.persistent.timeCharacterAssigned === null ||
      v.persistent.timeCharacterAssigned > time
    ) {
      // It is possible for the time assignment to be in the future, since it is based on the time
      // since the operating system started.
      v.persistent.timeCharacterAssigned = time;
    }

    const buildLockedUntilTime =
      v.persistent.timeCharacterAssigned + RANDOM_CHARACTER_LOCK_MILLISECONDS;
    if (
      time > buildLockedUntilTime ||
      v.persistent.selectedCharacters.length === 0
    ) {
      this.refreshStartingCharactersAndOtherThings();
    }
  }

  refreshStartingCharactersAndOtherThings(): void {
    const challenge = Isaac.GetChallenge();
    const time = Isaac.GetTime();
    const characters = SEASON_CHARACTERS[challenge];
    if (characters === undefined) {
      error(
        `Failed to get the starting characters for custom challenge: ${challenge}`,
      );
    }

    v.persistent.selectedCharacters = [];
    v.persistent.remainingCharacters = copyArray(characters);
    v.persistent.timeCharacterAssigned = time; // We will assign the character in the next function.

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

  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD) // 70
  preSpawnClearAward(): boolean | undefined {
    if (!isSpeedrunWithRandomCharacterOrder()) {
      return;
    }

    this.checkResetTimeAssigned();
    return undefined;
  }

  /** Reset the starting character timer if we just killed the Basement 2 boss. */
  checkResetTimeAssigned(): void {
    const roomType = g.r.GetType();
    const effectiveStage = getEffectiveStage();
    const roomInsideGrid = isRoomInsideGrid();

    if (
      effectiveStage === LevelStage.BASEMENT_2 &&
      roomType === RoomType.BOSS &&
      roomInsideGrid
    ) {
      v.persistent.timeCharacterAssigned = 0;
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
    v.persistent.lastSelectedCharacter === null
      ? []
      : [v.persistent.lastSelectedCharacter];
  if (challenge === ChallengeCustom.SEASON_4) {
    const characterNum = speedrunGetCharacterNum();
    if (characterNum <= 2) {
      for (const character of SEASON_4_STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND) {
        if (!characterExceptions.includes(character)) {
          characterExceptions.push(character);
        }
      }
    }
  }

  // Select a new starting character.
  const startingCharacter = getRandomArrayElementAndRemove(
    v.persistent.remainingCharacters,
    undefined,
    characterExceptions,
  );

  v.persistent.selectedCharacters.push(startingCharacter);
  v.persistent.lastSelectedCharacter = startingCharacter;

  return startingCharacter;
}

/** Used for the random character order feature. */
function speedrunGetCurrentSelectedCharacter(): PlayerType | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedCharacters[characterNum - 1];
}
