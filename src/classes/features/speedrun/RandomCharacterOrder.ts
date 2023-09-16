import type { Challenge } from "isaac-typescript-definitions";
import {
  LevelStage,
  ModCallback,
  PlayerType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  copyArray,
  emptyArray,
  getRandomArrayElementAndRemove,
  inRoomType,
  isRoomInsideGrid,
  onEffectiveStage,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { g } from "../../../globals";
import { onSeason } from "../../../speedrun/utilsSpeedrun";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../mandatory/misc/RestartOnNextFrame";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import {
  speedrunGetCharacterNum,
  speedrunSetFastReset,
} from "./characterProgress/v";
import { SEASON_4_STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND } from "./season4/constants";

/** How long the randomly-selected character is "locked-in". */
const RANDOM_CHARACTER_SELECTION_LOCK_MINUTES = g.debug ? 0.2 : 1.25;
const RANDOM_CHARACTER_LOCK_SECONDS =
  RANDOM_CHARACTER_SELECTION_LOCK_MINUTES * 60;
export const RANDOM_CHARACTER_LOCK_MILLISECONDS =
  RANDOM_CHARACTER_LOCK_SECONDS * 1000;

const CHALLENGES_WITH_RANDOM_CHARACTER_ORDER = [
  ChallengeCustom.SEASON_2,
  ChallengeCustom.SEASON_3,
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
     * The time (in milliseconds) that the first random character was assigned. This is is set to 0
     * when the Basement 2 boss is defeated.
     */
    timeFirstCharacterAssigned: null as int | null,
  },
};

export class RandomCharacterOrder extends ChallengeModFeature {
  challenge = CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET;
  v = v;

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    this.checkResetTimeAssigned();
    return undefined;
  }

  /** Reset the starting character timer if we just killed the Basement 2 boss. */
  checkResetTimeAssigned(): void {
    if (
      onEffectiveStage(LevelStage.BASEMENT_2) &&
      inRoomType(RoomType.BOSS) &&
      isRoomInsideGrid()
    ) {
      v.persistent.timeFirstCharacterAssigned = 0; // Setting to null does not work.
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    this.checkFirstSpeedrunCharacterRefresh();

    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();
    const startingCharacter = getRandomlySelectedStartingCharacter();
    if (character !== startingCharacter) {
      speedrunSetFastReset();
      restartOnNextFrame();
      setRestartCharacter(startingCharacter);
    }
  }

  checkFirstSpeedrunCharacterRefresh(): void {
    const characterNum = speedrunGetCharacterNum();
    if (characterNum !== 1) {
      return;
    }

    const time = Isaac.GetTime();
    if (
      v.persistent.timeFirstCharacterAssigned === null ||
      v.persistent.timeFirstCharacterAssigned > time
    ) {
      // It is possible for the time assignment to be in the future, since it is based on the time
      // since the operating system started.
      v.persistent.timeFirstCharacterAssigned = time;
    }

    const characterLockedUntilTime =
      v.persistent.timeFirstCharacterAssigned +
      RANDOM_CHARACTER_LOCK_MILLISECONDS;
    if (
      time > characterLockedUntilTime ||
      v.persistent.selectedCharacters.length === 0
    ) {
      this.refreshStartingCharacters();
    }
  }

  refreshStartingCharacters(): void {
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
    v.persistent.timeFirstCharacterAssigned = time; // We will assign the character later on.
  }
}

export function getRandomlySelectedStartingCharacter(): PlayerType {
  // First, handle the case where we have already selected a starting character.
  const oldStartingCharacter = getCurrentRandomCharacter();
  if (oldStartingCharacter !== undefined) {
    return oldStartingCharacter;
  }

  // Prepare a list of characters that should not be possible for this segment of the speedrun.
  const characterExceptions =
    v.persistent.lastSelectedCharacter === null
      ? []
      : [v.persistent.lastSelectedCharacter];

  const characterNum = speedrunGetCharacterNum();
  if (onSeason(4) && characterNum <= 2) {
    for (const character of SEASON_4_STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND) {
      if (!characterExceptions.includes(character)) {
        characterExceptions.push(character);
      }
    }
  }

  if (v.persistent.remainingCharacters.length === 0) {
    error(
      "Failed to get a random starting character since there were no remaining characters.",
    );
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

export function isSpeedrunWithRandomCharacterOrder(): boolean {
  const challenge = Isaac.GetChallenge();
  return CHALLENGES_WITH_RANDOM_CHARACTER_ORDER_SET.has(challenge);
}

function getCurrentRandomCharacter(): int | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedCharacters[characterNum - 1];
}

export function randomCharacterOrderResetPersistentVars(): void {
  emptyArray(v.persistent.selectedCharacters);
  emptyArray(v.persistent.remainingCharacters);
  v.persistent.lastSelectedCharacter = null;
  v.persistent.timeFirstCharacterAssigned = null;
}
