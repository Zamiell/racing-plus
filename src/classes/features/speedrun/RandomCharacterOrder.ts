import {
  Challenge,
  LevelStage,
  ModCallback,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  copyArray,
  emptyArray,
  getEffectiveStage,
  getRandomArrayElementAndRemove,
  isRoomInsideGrid,
  ModCallbackCustom,
  ReadonlySet,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { season2ResetBuilds } from "../../../features/speedrun/season2/v";
import {
  speedrunGetCharacterNum,
  speedrunSetFastReset,
} from "../../../features/speedrun/v";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../../../features/utils/restartOnNextFrame";
import { g } from "../../../globals";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/checkErrors/v";
import { SEASON_4_STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND } from "./season4Constants";

/** How long the randomly-selected character and/or build combination is "locked-in". */
const RANDOM_CHARACTER_SELECTION_LOCK_MINUTES = g.debug ? 0.01 : 1.25;
export const RANDOM_CHARACTER_LOCK_SECONDS =
  RANDOM_CHARACTER_SELECTION_LOCK_MINUTES * 60;
export const RANDOM_CHARACTER_LOCK_MILLISECONDS =
  RANDOM_CHARACTER_LOCK_SECONDS * 1000;

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

    /**
     * The time (in milliseconds) that the random character was assigned. This is is set to 0 when
     * the Basement 2 boss is defeated.
     */
    timeCharacterAssigned: null as int | null,

    /**
     * The time (in milliseconds) that the build bans were set in the "Change Char Order" custom
     * challenge.
     */
    timeBuildBansSet: null as int | null,
  },
};

export function isSpeedrunWithRandomCharacterOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  return CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET.has(challenge);
}

export function randomCharacterOrderResetPersistentVars(): void {
  emptyArray(v.persistent.selectedCharacters);
  emptyArray(v.persistent.remainingCharacters);
  v.persistent.lastSelectedCharacter = null;
  v.persistent.timeCharacterAssigned = null;
  // `timeBansSet` is not reset since it has to do with the Change Char Order challenge.
}

/** In milliseconds. */
export function getBuildBansTime(): number | undefined {
  return v.persistent.timeBuildBansSet ?? undefined;
}

export function setBuildBansTime(): void {
  v.persistent.timeBuildBansSet = Isaac.GetTime();
}

export class RandomCharacterOrder extends ChallengeModFeature {
  challenge = CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET;
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
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
